import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface ActionItem {
  id: string;
  icon: string;
  label: string;
  color: string;
}

interface ActionButtonGroupProps {
  actions: ActionItem[];
  onAction: (actionId: string) => void;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({ actions, onAction }) => {
  return (
    <View className={styles.container}>
      {actions.map(action => (
        <View
          key={action.id}
          className={styles.actionItem}
          onClick={() => onAction(action.id)}
        >
          <View
            className={styles.iconWrapper}
            style={{ backgroundColor: action.color }}
          >
            <Text className={styles.icon}>{action.icon}</Text>
          </View>
          <Text className={styles.label}>{action.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default ActionButtonGroup;
