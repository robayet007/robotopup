import React from 'react';
import { FaYoutube, FaFacebook, FaWhatsapp, FaPhone, FaEnvelope, FaPlayCircle } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';

const Niyom: React.FC = () => {
  // Common contact card style
  const contactCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '25px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  };

  const contactCardHoverStyle: React.CSSProperties = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  };

  return (
    <section className="section steps" style={styles.section}>
      {/* Header Section */}
      {/* <div style={styles.header}>
        <h1 style={styles.headline}>
          📱 আপনার SMS অটোমেটিক ডাটাবেজে সেভ করুন
        </h1>
        <p style={styles.subtitle}>
          সহজ ৩টি স্টেপে সেটআপ করুন - কোনো কোডিং নলেজ ছাড়াই!
        </p>
      </div> */}

      {/* Steps Section */}
      {/* <div style={styles.stepsContainer}>
        <div style={styles.stepCard}>
          <div style={styles.stepNumber}>১</div>
          <h3 style={styles.stepTitle}>Automate App ইনস্টল করুন</h3>
          <p style={styles.stepDescription}>
            Play Store থেকে "Automate" অ্যাপ ডাউনলোড করুন এবং SMS permission দিন
          </p>
          <div style={styles.stepIcon}>📱</div>
        </div>

        <div style={styles.stepCard}>
          <div style={styles.stepNumber}>২</div>
          <h3 style={styles.stepTitle}>Flow কনফিগার করুন</h3>
          <p style={styles.stepDescription}>
            SMS received → HTTP request সেট করুন। আপনার API URL যোগ করুন
          </p>
          <div style={styles.stepIcon}>⚙️</div>
        </div>

        <div style={styles.stepCard}>
          <div style={styles.stepNumber}>৩</div>
          <h3 style={styles.stepTitle}>টেস্ট করুন</h3>
          <p style={styles.stepDescription}>
            SMS পাঠান এবং ড্যাশবোর্ডে real-time ডাটা দেখুন
          </p>
          <div style={styles.stepIcon}>✅</div>
        </div>
      </div> */}

      {/* YouTube Tutorial Section - ACTUAL VIDEO EMBED */}
      <div style={styles.tutorialSection}>
        <div style={styles.sectionHeader}>
          <FaYoutube style={{...styles.icon, color: '#FF0000'}} />
          <h2 style={styles.sectionTitle}>ভিডিও টিউটোরিয়াল দেখুন</h2>
        </div>
        
        <div style={styles.videoWrapper}>
          {/* YouTube Video Embed */}
          <div style={styles.videoContainer}>
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/SjktGy7lEUw"
              title="SMS Forwarder Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={styles.videoFrame}
            ></iframe>
          </div>
          
          <div style={styles.videoInfo}>
            <div style={styles.videoMeta}>
              <FaPlayCircle style={styles.playIcon} />
              <div>
                {/* <h3 style={styles.videoTitle}>SMS ফরওয়ার্ডার সম্পূর্ণ টিউটোরিয়াল</h3> */}
                <p style={styles.videoDescription}>
                  {/* Automate App থেকে শুরু করে API কানেকশন পর্যন্ত সবকিছু ডিটেইলে দেখানো হয়েছে */}
                </p>
              </div>
            </div>
            
            <div style={styles.videoStats}>
              {/* <span style={styles.stat}>⏱️ 15:30 মিনিট</span>
              <span style={styles.stat}>👁️ ২৫০+ Views</span>
              <span style={styles.stat}>📅 ২৩ এপ্রিল ২০২৪</span> */}
            </div>
          </div>
        </div>
        
        <div style={styles.youtubeActions}>
          <a 
            href="https://www.youtube.com/watch?v=SjktGy7lEUw" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.youtubeButton}
          >
            <FaYoutube style={styles.buttonIcon} />
            YouTube-এ দেখুন
          </a>
          
          <a 
            href="https://www.youtube.com/channel/UC_course" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.subscribeButton}
          >
            <FaYoutube style={styles.buttonIcon} />
            চ্যানেলে সাবস্ক্রাইব করুন
          </a>
        </div>
      </div>

      {/* Contact Section - ICONS WITH COLORS */}
      <div style={styles.contactSection}>
        <div style={styles.sectionHeader}>
          <FaEnvelope style={{...styles.icon, color: '#3498db'}} />
          <h2 style={styles.sectionTitle}>যোগাযোগ করুন</h2>
        </div>
        
        <div style={styles.contactGrid}>
          {/* WhatsApp - GREEN */}
          <a 
            href={`https://wa.me/8801766325020`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              ...contactCardStyle,
              borderColor: '#25D366',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.1)';
              Object.assign(e.currentTarget.style, contactCardHoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.contactIconContainer}>
              <FaWhatsapp style={{...styles.contactIcon, color: '#25D366'}} />
            </div>
            <div style={styles.contactInfo}>
              <h3 style={styles.contactTitle}>WhatsApp</h3>
              <p style={styles.contactDetail}>+880 1766-325020</p>
              <p style={styles.contactHint}>সরাসরি মেসেজ পাঠান</p>
            </div>
          </a>

          {/* Phone Call - BLUE */}
          <a 
            href="tel:+8801766325020" 
            style={{
              ...contactCardStyle,
              borderColor: '#3498db',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
              Object.assign(e.currentTarget.style, contactCardHoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.contactIconContainer}>
              <FaPhone style={{...styles.contactIcon, color: '#3498db'}} />
            </div>
            <div style={styles.contactInfo}>
              <h3 style={styles.contactTitle}>ফোন কল</h3>
              <p style={styles.contactDetail}>01766-325020</p>
              <p style={styles.contactHint}>সরাসরি কল করুন</p>
            </div>
          </a>

          {/* Facebook - FACEBOOK BLUE */}
          <a 
            href="https://m.me/yourpage" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              ...contactCardStyle,
              borderColor: '#1877F2',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(24, 119, 242, 0.1)';
              Object.assign(e.currentTarget.style, contactCardHoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.contactIconContainer}>
              <FaFacebook style={{...styles.contactIcon, color: '#1877F2'}} />
            </div>
            <div style={styles.contactInfo}>
              <h3 style={styles.contactTitle}>Facebook Messenger</h3>
              <p style={styles.contactDetail}>মেসেজ পাঠান</p>
              <p style={styles.contactHint}>ফেসবুক মেসেনজারে</p>
            </div>
          </a>

          {/* Instagram - INSTAGRAM GRADIENT */}
          <a 
            href="https://instagram.com/yourprofile" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              ...contactCardStyle,
              border: '2px solid transparent',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #ff9a3d 0%, #ff784c 25%, #ff3855 50%, #ff2a6d 75%, #ff1b8d 100%)';
              Object.assign(e.currentTarget.style, contactCardHoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.contactIconContainer}>
              <AiFillInstagram style={{...styles.contactIcon, color: 'white'}} />
            </div>
            <div style={styles.contactInfo}>
              <h3 style={{...styles.contactTitle, color: 'white'}}>Instagram</h3>
              <p style={{...styles.contactDetail, color: 'white'}}>DM পাঠান</p>
              <p style={{...styles.contactHint, color: 'rgba(255,255,255,0.8)'}}>সরাসরি মেসেজ</p>
            </div>
          </a>
        </div>
        
        {/* Contact Info Box */}
        <div style={styles.contactInfoBox}>
          <h3 style={styles.contactInfoTitle}>📞 যোগাযোগের তথ্য</h3>
          <div style={styles.contactDetails}>
            <p style={styles.contactDetailItem}>
              <strong>ফোন:</strong> 01766-325020
            </p>
            <p style={styles.contactDetailItem}>
              <strong>WhatsApp:</strong> একই নাম্বার
            </p>
            <p style={styles.contactDetailItem}>
              <strong>ইমেইল:</strong> support@example.com
            </p>
            <p style={styles.contactDetailItem}>
              <strong>সময়:</strong> সকাল ৯টা - রাত ১০টা
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Inline CSS Styles
const styles = {
  section: {
    backgroundColor: '#f8f9fa',
    padding: '60px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '50px',
  },
  headline: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '15px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    maxWidth: '600px',
    margin: '0 auto',
  },
  stepsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '60px',
  },
  stepCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    flex: '1',
    minWidth: '280px',
    maxWidth: '350px',
    textAlign: 'center' as const,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    position: 'relative' as const,
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontSize: '1.4rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  stepDescription: {
    color: '#7f8c8d',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  stepIcon: {
    fontSize: '2rem',
    marginTop: '10px',
  },
  tutorialSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    marginBottom: '60px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  },
  icon: {
    fontSize: '2rem',
    marginRight: '15px',
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: 0,
  },
  videoWrapper: {
    marginBottom: '30px',
  },
  videoContainer: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    marginBottom: '20px',
  },
  videoFrame: {
    border: 'none',
    display: 'block',
  },
  videoInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
  },
  videoMeta: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  playIcon: {
    fontSize: '1.5rem',
    color: '#FF0000',
    marginRight: '15px',
    marginTop: '3px',
  },
  videoTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    margin: '0 0 5px 0',
  },
  videoDescription: {
    color: '#7f8c8d',
    margin: 0,
    lineHeight: '1.5',
  },
  videoStats: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap' as const,
  },
  stat: {
    backgroundColor: 'white',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    color: '#666',
  },
  youtubeActions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  youtubeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  subscribeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#282828',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  buttonIcon: {
    marginRight: '10px',
    fontSize: '1.2rem',
  },
  contactSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  contactIconContainer: {
    marginRight: '20px',
    flexShrink: 0,
  },
  contactIcon: {
    fontSize: '2.5rem',
  },
  contactInfo: {
    flex: '1',
  },
  contactTitle: {
    fontSize: '1.2rem',
    margin: '0 0 5px 0',
    color: '#2c3e50',
  },
  contactDetail: {
    fontSize: '1.1rem',
    margin: '0 0 5px 0',
    fontWeight: '600',
    color: '#2c3e50',
  },
  contactHint: {
    fontSize: '0.9rem',
    margin: 0,
    color: '#7f8c8d',
  },
  contactInfoBox: {
    backgroundColor: '#f0f7ff',
    borderRadius: '10px',
    padding: '25px',
    borderLeft: '5px solid #3498db',
  },
  contactInfoTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  contactDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  contactDetailItem: {
    margin: '5px 0',
    color: '#555',
  },
};

export default Niyom;