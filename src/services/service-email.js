import nodemailer from 'nodemailer';



// const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//     to: "jcromero@pucp.edu.pe", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
// });
// console.log("Message sent: %s", info.messageId);

export function habilitarUsuarioEmail(destinatario,enable,){
    let htmlContent;

    if (enable) {
        htmlContent = `
            <div style="text-align: center;">
                <h1>¡Usuario Habilitado!</h1>
                <p>Su cuenta ha sido habilitada exitosamente.</p>
                <p>Ahora puede acceder a todas las funcionalidades de nuestro sistema.</p>
            </div>`;
    } else {
        htmlContent = `
            <div style="text-align: center;">
                <h1>Usuario Deshabilitado</h1>
                <p>Su cuenta ha sido deshabilitada.</p>
                <p>Para más información, póngase en contacto con el administrador.</p>
            </div>`;
    }

    return {
        from: '"Administrador" <josueromero1901@gmail.com>',
        to: destinatario,
        subject: enable ? 'HABILITAR USUARIO' : 'DESHABILITAR USUARIO',
        html: htmlContent,
    };
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "josueromero1901@gmail.com",
        pass: "hlnvdotscdqdjnwk"
    }
})

export {transporter} ;