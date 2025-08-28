document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = this.querySelector('input[name="name"]').value;
  const email = this.querySelector('input[name="email"]').value;
  const message = this.querySelector('textarea[name="message"]').value;

  emailjs.send("service_3h7ty7t", "template_2xc852t", {
    name: name,
    email: email,
    message: message
  })
  .then(() => {
    alert("Message sent!");
    this.reset();
  }, (error) => {
    alert("Failed to send. Try again later.");
    console.error(error);
  });
});
  