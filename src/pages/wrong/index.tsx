import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import QuestionCard from '@/components/QuestionCard';
import { Question } from '@/types/question';
import { getWrongQuestions, removeWrongQuestion } from '@/utils/storage';

export default function WrongPage() {
  const [wrongs, setWrongs] = useState<Question[]>([]);

  useDidShow(() => {
    setWrongs(getWrongQuestions());
  });

  const handleRemove = (id: number) => {
    removeWrongQuestion(id);
    setWrongs(getWrongQuestions());
  };

  if (wrongs.length === 0) {
    return (
      <View className={styles.container}>
        <View className={styles.empty}>
          <Text className={styles.icon}>🎉</Text>
          <Text>太棒了，目前没有错题！</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>我的错题</Text>
        <Text className={styles.count}>共 {wrongs.length} 题</Text>
      </View>

      {wrongs.map(q => (
        <View key={q.id}>
          <QuestionCard question={q} showAnalysis />
          <Button 
            style={{ marginBottom: '48rpx', background: '#f2f3f5', color: '#4e5969', fontSize: '28rpx', height: '64rpx', lineHeight: '64rpx', borderRadius: '32rpx' }}
            onClick={() => handleRemove(q.id)}
          >
            我已掌握，移出错题本
          </Button>
        </View>
      ))}
    </View>
  );
}
