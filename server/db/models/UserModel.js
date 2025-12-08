// db/models/UserModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["course", "consultation", "contest", "system"],
      default: "system",
    },
    unread: {
      type: Boolean,
      default: true,
    },
    senderBknetId: {
      type: String,
      default: null,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    bknetId: {
      type: String,
      required: [true, "BKNet ID is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["student", "tutor", "cod", "ctsv"],
      default: "student",
    },

    // Profile fields
    faculty: String,
    department: String,
    stuId: String,
    tutorId: String,

    // Tutor specific
    listCourseCanTeach: [String],
    education: [String],
    awards: [String],

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    // Notifications
    notifications: [notificationSchema],
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Indexes
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log("[COMPARE] Candidate password:", candidatePassword);
    console.log(
      "[COMPARE] Stored password hash:",
      this.password.substring(0, 20) + "..."
    );
    console.log(
      "[COMPARE] Hash starts with $2:",
      this.password.startsWith("$2")
    );
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log("[COMPARE] Comparison result:", result);
    return result;
  } catch (error) {
    console.log("[COMPARE] Error:", error.message);
    throw error;
  }
};

// Method to add notification
userSchema.methods.addNotification = function (notificationData) {
  this.notifications.unshift({
    title: notificationData.title,
    content: notificationData.content,
    type: notificationData.type || "system",
    senderBknetId: notificationData.senderBknetId || null,
    unread: true,
    time: new Date(),
  });
  return this.notifications[0];
};

// Method to mark notification as read
userSchema.methods.markNotificationRead = function (notificationId) {
  const notification = this.notifications.id(notificationId);
  if (notification) {
    notification.unread = false;
  }
  return notification;
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
