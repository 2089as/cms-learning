import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faArrowLeft, faRedo, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import emailjs from '@emailjs/browser';

function CertificateScreen({ onBack, onRestart, level }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    onBack();
  };

  const handleRestart = () => {
    onRestart();
  };

  const handleSendCertificate = (e) => {
    e.preventDefault();

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setMessage('Please enter an email address!');
      return;
    }
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address!');
      return;
    }

    setIsLoading(true);
    // Thông tin gửi email qua EmailJS
    const templateParams = {
      to_email: email,
      level: level || 'Unknown',
      completion_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    // Thay YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY bằng giá trị từ EmailJS
    emailjs
      .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
      .then((response) => {
        console.log('Email sent successfully:', response);
        setMessage('Certificate sent successfully to your email!');
        setEmail('');
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        setMessage('Failed to send certificate. Please try again!');
        setIsLoading(false);
      });
  };

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faCertificate} /> Congratulations!
      </h2>
      <div className="certificate">
        <p>
          You have completed the <strong>{level || 'Unknown'}</strong> level course after 30 days of learning!
        </p>
        <p>Enter your email to receive your certificate:</p>
        <form onSubmit={handleSendCertificate} className="email-form">
          <label htmlFor="email-input">Email Address</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="email-input"
            disabled={isLoading}
          />
          {message && (
            <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
          <button type="submit" disabled={isLoading}>
            <FontAwesomeIcon icon={faPaperPlane} /> {isLoading ? 'Sending...' : 'Send Certificate'}
          </button>
        </form>
      </div>
      <button onClick={handleRestart}>
        <FontAwesomeIcon icon={faRedo} /> Start Over
      </button>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default CertificateScreen;