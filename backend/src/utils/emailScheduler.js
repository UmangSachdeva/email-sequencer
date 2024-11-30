import Agenda from "agenda";
import nodemailer from "nodemailer";
import Sequence from "../models/sequence.model.js";

// Initializing Agenda with MongoDB URI
const agenda = new Agenda({
  db: { address: `${process.env.MONGODB_URI}` },
});

// Defining a Job to send schedule emails
agenda.define("send email", async (job, done) => {
  const { to, subject, text, is_last, sequence_id } = job.attrs.data; // getting email information from job attribute

  // Nodemailer transporter
  let transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  // Email Address options
  let mailOptions = {
    from: "test@test.com",
    to,
    text,
    subject,
  };

  // Sending the email
  transport.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
    } else {
      if (is_last) {
        await Sequence.findByIdAndUpdate(sequence_id, { status: "completed" })
      }

      console.log("Email sent: " + info.response);
    }
    done(); // Completion of job
  });
});

// Function to schedule email

/* 
INFO: Steps for implementing the feature: 
  1. Find the document of the sequence added by the user from Database 
  2. Find the node leading the sequence
  3. Get the email address of the recipient
  4. Iterate through the sequence and add delay if the node is Wait/Delay and schedule the email if the node is Cold Email
  5. Update the sequence and to not show next time in the query
*/

const scheduleEmails = async (seq) => {
  const sequence = await Sequence.findById(seq._id); // Find the sequence document

  if (!sequence) {
    console.log("No sequence found");
    return;
  }

  // Find the lead source node in the sequence
  const leadSourceNode = sequence.nodes.find((n) =>
    n.data.label.startsWith("Lead-Source")
  );

  if (!leadSourceNode) {
    console.log("No Lead-Source node found, skipping sequence");
    await Sequence.findByIdAndDelete(sequence._id);
    return;
  }

  // Extract the recipient email address from the lead source node label
  const to = leadSourceNode?.data?.label?.split("- (")[1].split(")")[0];

  let totalDelay = 0; // Initialize total delay

  // Iterate through the nodes in the sequence
  for (const node of sequence.nodes) {
    if (node.data.label.startsWith("Cold-Email")) {
      // Extract subject and text from Cold-Email node label
      const subject = node.data.label.split("\n- (")[1]?.split(")")[0];
      const text = node.data.label.split(") ")[1] || "";

      // Add 5 seconds delay between emails to maintain the order
      totalDelay += 5000;

      // Schedule the email with the accumulated delay
      agenda.schedule(new Date(Date.now() + totalDelay), "send email", {
        to,
        subject,
        text,
        sequence_id: sequence._id,
        is_last: sequence.nodes.indexOf(node) == sequence.nodes.length - 1
      });
    } else if (node.data.label.startsWith("Wait/Delay")) {
      // Extract the delay time from the Wait/Delay node label and convert to milliseconds
      const delay = parseInt(
        node.data.label.split("- (")[1]?.split(" min")[0],
        10
      );
      totalDelay += delay * 60 * 1000; // Add the specified delay time to the total delay
    }
  }

  // Delete the sequence after scheduling all emails
  await Sequence.findByIdAndUpdate(sequence._id, { status: "scheduled" });
};

export { agenda, scheduleEmails };
