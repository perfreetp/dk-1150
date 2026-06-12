import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagOption {
  value: string;
  label: string;
  icon?: string;
}

interface TagSelectorProps {
  options: TagOption[];
  value: string;
  onChange: (value: string) => void;
  type?: 'button' | 'card';
}

const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  value,
  onChange,
  type = 'button'
}) => {
  if (type === 'card') {
    return (
      <View className={styles.cardContainer}>
        {options.map(option => (
          <View
            key={option.value}
            className={classnames(
              styles.cardItem,
              value === option.value && styles.selectedCardItem
            )}
            onClick={() => onChange(option.value)}
          >
            <Text className={styles.cardIcon}>{option.icon}</Text>
            <Text className={styles.cardLabel}>{option.label}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className={styles.buttonContainer}>
      {options.map(option => (
        <View
          key={option.value}
          className={classnames(
            styles.buttonItem,
            value === option.value && styles.selectedButtonItem
          )}
          onClick={() => onChange(option.value)}
        >
          <Text className={value === option.value ? styles.selectedText : styles.text}>
            {option.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default TagSelector;
