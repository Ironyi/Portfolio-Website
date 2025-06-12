document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const message = this.querySelector("textarea").value;
  
    emailjs.send("service_3h7ty7t", "template_2xc852t", {
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
  