# API Documentation

## Auth Routes

### Register

POST /api/auth/register

Body:

```json
{
  "name": "Swathi",
  "email": "swathi@gmail.com",
  "password": "123456",
  "role": "admin"
}
```

---

### Login

POST /api/auth/login

Body:

```json
{
  "email": "swathi@gmail.com",
  "password": "123456"
}
```

---

## Lead Routes

### Get Leads

GET /api/leads

---

### Create Lead

POST /api/leads

Body:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "status": "Qualified",
  "source": "Instagram"
}
```

---

### Delete Lead

DELETE /api/leads/:id