import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function TestModal({ onClose }: { onClose: () => void }) {
  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '16px', 
          border: '4px solid red',
          maxWidth: '600px',
          width: '100%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'black', marginBottom: '20px' }}>
          TEST MODAL VISIBLE
        </h1>
        <p style={{ fontSize: '24px', color: 'black', marginBottom: '20px' }}>
          If you see this, the modal works!
        </p>
        <button 
          onClick={onClose}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: 'black', 
            color: 'white', 
            borderRadius: '8px', 
            fontSize: '18px', 
            cursor: 'pointer',
            border: 'none'
          }}
        >
          Close
        </button>
      </div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}
