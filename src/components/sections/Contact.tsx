import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { Mail, MapPin, Smartphone, Send } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import TerminalText from '../effects/TerminalText';
import { useContent } from '../../context/ContentContext';


const Contact: React.FC = () => {
  const { contact } = useContent();
  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      'service_475xwpc',
      'template_4ak0zbo',
      formRef.current!,
      'n1Lelf96Q3rp364I0'
    )
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        setIsSubmitting(false);
        alert('Failed to send message. Please try again later.');
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="min-h-screen py-20 flex items-center"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm uppercase tracking-wider font-mono mb-2" style={{ color: `var(--secondary)` }}>
            Get In Touch
          </h2>
          <h3 className="text-4xl font-bold mb-4">
            <GlitchText text="Contact" className="mr-2 text-white" />
            <span style={{ color: `var(--primary)` }}>Portal</span>
          </h3>
          <div className="h-1 w-20 mx-auto" style={{ background: `linear-gradient(to right, var(--primary), var(--secondary))` }}></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left: Info */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gray-900/25 backdrop-blur-md p-8 rounded-lg border border-white/10 hover:border-primary/30 transition-all">
              <h4 className="text-xl font-bold mb-6 text-white">
                <span className="text-purple-400 font-mono mr-2">$</span>
                Connect With Me
              </h4>

              <TerminalText
                text="I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision."
                className="text-gray-300 block mb-6"
                speed={20}
              />

              <div className="space-y-6">
                <div>
                  <a href={contact.mapLink} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
                        <MapPin className="text-primary" size={20} />
                      </div>
                      <div>
                        <h5 className="text-gray-200 font-bold">Location</h5>
                        <p className="text-gray-400">{contact.location}</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div>
                  <a href={`mailto:${contact.email}`} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-black/50 rounded-lg border border-gray-800">
                        <Mail className="text-primary" size={20} />
                      </div>
                      <div >
                        <h5 className="text-gray-200 font-bold">Email</h5>
                        <p className="text-gray-400">{contact.email}</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div>
                  <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-black/50 rounded-lg border border-gray-800">
                        <Smartphone className="text-primary" size={20} />
                      </div>
                      <div>
                        <h5 className="text-gray-200 font-bold">WhatsApp</h5>
                        <p className="text-gray-400"> {contact.whatsapp}</p>
                      </div>
                    </div>
                  </a>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-gray-900/25 backdrop-blur-md p-8 rounded-lg border border-white/10 hover:border-primary/40 transition-all">
              <h4 className="text-xl font-bold mb-6 text-white">
                <span className="text-secondary font-mono mr-2">$</span>
                Send Message
              </h4>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/30 text-green-400 p-4 rounded-md border border-green-700 mb-4"
                >
                  <p className="font-mono">
                    <span className="text-green-400 mr-2">✓</span>
                    Message sent successfully! I'll respond as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="subject" value={formState.subject} />

                  <div>
                    <label htmlFor="name" className="text-gray-300 mb-1 block text-sm">
                      <span className="text-primary mr-1">*</span>Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-md text-white focus:border-primary focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-gray-300 mb-1 block text-sm">
                      <span className="text-primary mr-1">*</span>Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-md text-white focus:border-primary focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="text-gray-300 mb-1 block text-sm">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-md text-white focus:border-primary focus:outline-none transition-colors"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="text-gray-300 mb-1 block text-sm">
                      <span className="text-primary mr-1">*</span>Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-md text-white resize-none focus:border-primary focus:outline-none transition-colors"
                      placeholder="Hello, I'd like to discuss a project..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-md text-black font-bold font-mono flex items-center justify-center gap-2 transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    style={{ background: `linear-gradient(to right, var(--primary), var(--secondary))` }}
                  >
                    {isSubmitting ? 'Sending...' : <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
