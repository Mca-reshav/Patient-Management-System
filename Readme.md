# Patient Management System (PMS)

## Overview
The **Patient Management System (PMS)** is a backend API built using **Node.js**, **Express.js**, **PostgreSQL**, and **Sequelize**. It follows a role-based access control system to manage users, patients, doctors, and appointments.

---

## Project Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize CLI](https://sequelize.org/)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mca-reshav/Patient-Management-System.git
   cd patient-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the database:**
   - Create a PostgreSQL database
   - Configure `.env` file with database credentials:
     ```
     DB_NAME=your_database_name
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_HOST=localhost
     DB_PORT=5432
     JWT_SECRET=your_secret_key
     ```

4. **Run database migrations:**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:6001/` and `http://localhost:6002/`.

---

## API Documentation

### 1. User Management

#### **User Registration**
- **Endpoint:** `POST /web/user/register`
- **Description:** Registers a new user.

#### **User Login**
- **Endpoint:** `POST /web/user/login`
- **Description:** Logs in a user and returns a JWT token.

#### **Update Role**
- **Endpoint:** `GET /web/user/updateRole`
- **Description:** Updates user roles (Admin, Doctor, Patient).

---

### 2. Patient Management

#### **Register Patient**
- **Endpoint:** `POST /web/patient/register/2`
- **Description:** Registers a new patient.
- **Authorization:** Bearer Token required.

#### **Get Patients List**
- **Endpoint:** `GET /web/patient/list`
- **Description:** Retrieves a list of all patients.
- **Authorization:** Bearer Token required.

#### **Assign Doctor**
- **Endpoint:** `POST /web/patient/assignDoc`
- **Description:** Assigns a doctor to a patient.
- **Authorization:** Bearer Token required.

---

### 3. Appointments

#### **Book an Appointment**
- **Endpoint:** `POST /web/appointment/book`
- **Description:** Books an appointment for a patient.
- **Authorization:** Bearer Token required.
- **Request Body:**
  ```json
  {
      "patientId": 1,
      "dateOfAppointment": "2025-11-21"
  }
  ```

#### **Check Available Slot**
- **Endpoint:** `POST /web/appointment/availableSlot`
- **Description:** Checks available slots for booking.

#### **Get List of Appointments**
- **Endpoint:** `GET /web/appointment/list`
- **Description:** Retrieves all booked appointments.
- **Authorization:** Bearer Token required.

---

## Authorization
All secured endpoints require **JWT Bearer Token** authentication.
Include the following header:
```plaintext
Authorization: Bearer <token>
```

---

## Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Backend framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database interactions
- **JWT** - Authentication and authorization

---

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License
This project is licensed under the MIT License.

