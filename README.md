# Automated Email Sequencer

`Automated Email Sequencer` is a `MERN Stack` application designed to help users create and manage automated email campaigns using an interactive flowchart interface. The app leverages `React Flow` for visualizing workflows, `Agenda` for scheduling emails, and `Nodemailer` for sending them.

## Key Features

- **Flowchart-Based Design**: A user-friendly interface for designing email sequences.
- **Custom Node Types**:
  - **Lead-Source Node**: Specifies the email recipients.
  - **Cold-Email Node**: Represents individual emails with customizable subject lines and body content.
  - **Wait/Delay Node**: Inserts time intervals between emails.
- **Automated Scheduling**: Emails are scheduled and sent automatically based on the designed flowchart.
- **Modal Forms**: Simplified forms for adding or modifying nodes and their properties.
- **Backend Integration**: Transmits node and edge data to the backend to initiate the email sequence.

## Technology Stack

- **Frontend**:
  - React
  - React Flow
  - Axios
  - React Modal
- **Backend**:
  - Node.js
  - Express
  - Agenda
  - Nodemailer
  - MongoDB (with Mongoose)

## Setup Instructions

### Configure Environment Variables

Create separate `.env` files for the frontend and backend based on the `.env.sample` templates, and populate them with the required values.

### Install Dependencies

Run the following commands to install dependencies for both the backend and frontend:

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd frontend
npm install

### Open the application

Open your browser and navigate to http://localhost:5173 to view the application.
```
