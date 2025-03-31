import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"naveen1@tothenew.com",
        pass:"omtv rphp izht clsz"
    }
});

export const confirmation = async(userEmail, doctorName, appointmentTime,appointmentdate)=>{
    try {
        const mailOptions = {
          from: "naveen1@tothenew.com",
          to: userEmail,
          subject: "Appointment Confirmation",
          text: `Your appointment with Dr. ${doctorName} has been approved for ${appointmentTime}. on date ${appointmentdate}`,
        };
    
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
      }
}