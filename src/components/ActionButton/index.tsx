import React from 'react';
import { Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  onClick,
  type = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false
}) => {
  return (
    <Button
      className={classnames(
        styles.button,
        styles[type],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default ActionButton;
