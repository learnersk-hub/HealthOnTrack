# Database Setup for HealthOnTrack

## SQLite Database Integration

This project now uses SQLite for data persistence. The database is automatically initialized when you first use any API endpoint.

### Database Features

- **User Management**: Secure user authentication with password hashing
- **Emergency Requests**: Track and manage medical emergencies
- **Vital Signs**: Record and monitor patient vital signs
- **Prescriptions**: Digital prescription management
- **Messages**: Chat functionality for emergency communications
- **Train Management**: Monitor trains and medical equipment
- **Device Monitoring**: Track medical device status

### Database Location

The SQLite database file is created at: `./data/healthontrack.db`

### Automatic Initialization

The database schema is automatically created when:
1. You start the development server (`npm run dev`)
2. Any API endpoint is called for the first time
3. The application detects that the database doesn't exist

### Default Data

The system automatically creates:
- 3 sample trains with medical equipment
- Database tables with proper relationships and constraints

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

#### Emergency Management
- `POST /api/emergency` - Create emergency request
- `GET /api/emergency?passengerId=ID` - Get user's emergencies
- `GET /api/emergency?status=pending` - Get pending emergencies
- `GET /api/emergency/[id]` - Get specific emergency
- `PATCH /api/emergency/[id]` - Update emergency status

#### Vital Signs
- `POST /api/vitals` - Record vital signs
- `GET /api/vitals?patientId=ID` - Get patient's vitals
- `GET /api/vitals?patientId=ID&latest=true` - Get latest vitals

#### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions?patientId=ID` - Get patient's prescriptions

#### Messages
- `POST /api/messages` - Send message
- `GET /api/messages?emergencyRequestId=ID` - Get emergency messages

#### Trains (Admin)
- `GET /api/trains` - Get all trains with equipment

### Security Features

- Password hashing using PBKDF2 with salt
- Role-based access control
- Input validation and sanitization
- SQL injection prevention with prepared statements

### Development

The database will be created automatically when you run:
```bash
npm run dev
```

Then visit any page that requires authentication or use the API endpoints directly.

### Production Deployment

For production deployment, ensure:
1. The `data` directory has write permissions
2. The SQLite database file can be created and accessed
3. Consider using a more robust database solution for high-traffic applications

### Backup

To backup your database, simply copy the `./data/healthontrack.db` file to a safe location.