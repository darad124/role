import { motion } from 'framer-motion';
import React from 'react';

const Motion = {
  div: motion.div,
  p: motion.p,
  // Add other HTML elements as needed
};

const Spring = {
  div: ({ children, ...props }) => (
    <motion.div
      initial={props.from}
      animate={props.to}
      transition={props.config}
    >
      {children}
    </motion.div>
  ),
  // Add other HTML elements as needed
};

export { Motion, Spring };