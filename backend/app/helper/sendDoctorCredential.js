const transporter = require("../config/emailConfig")

const sendDoctorCredentials = async (doctor, password) => {
    try {

        if (!doctor || !doctor.email) {
            console.log("Doctor email is missing")
            return
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER || "harshraz0009@gmail.com",
            to: doctor.email,
            subject: "Doctor Account Created",
            html: `
                <h2>Welcome ${doctor.name}</h2>
                <p>Your doctor account has been created.</p>

                <h3>Login Credentials</h3>
                <p><b>Email:</b> ${doctor.email}</p>
                <p><b>Password:</b> ${password}</p>

                <p>Please login and change your password.</p>

                <a href="${process.env.BACKEND_HOST}/doctor-login-page">
                    Login Here
                </a>
            `
        })

        console.log("Doctor credentials email sent")

    } catch (error) {
        console.log("Error sending doctor email:", error)
    }
}

module.exports = sendDoctorCredentials