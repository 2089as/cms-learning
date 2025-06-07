import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faArrowLeft, faRedo, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { createCertificate } from '../services/app';

function CertificateScreen({ user, onBack, onRestart, level }) {
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    onBack();
  };

  const handleRestart = () => {
    onRestart();
  };

  const handleSendCertificate = async (e) => {
    e.preventDefault();

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
    try {
      // Cập nhật email của user trước khi gửi certificate
      const updatedUser = { ...user, email };
      // Gọi API gửi certificate
      const certificateData = {
        user_id: user._id,
        level_id: level === 'beginner' ? 'level_1' : 'level_2',
        pdf_url: 'http://example.com/certificate.pdf', // Thay bằng URL thật
      };
      await createCertificate(certificateData);
      setMessage('Certificate sent successfully to your email!');
      setEmail('');
    } catch (error) {
      setMessage('Failed to send certificate: ' + error.message);
    } finally {
      setIsLoading(false);
    }
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