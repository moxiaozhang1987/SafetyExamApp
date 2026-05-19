import React from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import classnames from 'classnames';
import { Question } from '@/types/question';
import styles from './index.module.scss';

interface Props {
  question: Question;
  userAnswer?: string | string[];
  showAnalysis?: boolean;
  onAnswerChange?: (answer: string | string[]) => void;
}

export default function QuestionCard({ question, userAnswer, showAnalysis, onAnswerChange }: Props) {
  const isMultiple = question.type === 'multiple';

  const getTypeLabel = () => {
    switch (question.type) {
      case 'single': return '单选题';
      case 'multiple': return '多选题';
      case 'boolean': return '判断题';
      case 'short': return '简答题';
      default: return '未知题型';
    }
  };

  const handleOptionClick = (optKey: string) => {
    if (showAnalysis || !onAnswerChange) return;
    
    if (isMultiple) {
      const current = Array.isArray(userAnswer) ? userAnswer : [];
      if (current.includes(optKey)) {
        onAnswerChange(current.filter(k => k !== optKey));
      } else {
        onAnswerChange([...current, optKey].sort());
      }
    } else {
      onAnswerChange(optKey);
    }
  };

  const getOptionStatusClass = (optKey: string) => {
    if (!showAnalysis) {
      const isSelected = isMultiple 
        ? Array.isArray(userAnswer) && userAnswer.includes(optKey)
        : userAnswer === optKey;
      return isSelected ? styles.active : '';
    }

    const isCorrectAns = question.answer.includes(optKey);
    const isUserAns = isMultiple 
      ? Array.isArray(userAnswer) && userAnswer.includes(optKey)
      : userAnswer === optKey;

    if (isCorrectAns) return styles.correct;
    if (isUserAns && !isCorrectAns) return styles.error;
    return '';
  };

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Text className={styles.typeTag}>{getTypeLabel()}</Text>
        <Text className={styles.idTag}>第 {question.id} 题</Text>
      </View>
      
      <View className={styles.title}>
        <Text>{question.title}</Text>
      </View>

      {question.type !== 'short' ? (
        <View className={styles.options}>
          {question.options.map((opt, index) => {
            let optKey = '';
            if (question.type === 'boolean') {
              optKey = opt; // '正确' or '错误'
            } else {
              optKey = opt.charAt(0); // 'A', 'B', 'C'
            }

            return (
              <View 
                key={index}
                className={classnames(styles.option, getOptionStatusClass(optKey))}
                onClick={() => handleOptionClick(optKey)}
              >
                <Text>{opt}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View className={styles.shortAnsContainer}>
          <Textarea 
            className={styles.shortAnswer}
            placeholder={showAnalysis ? "（未作答）" : "请输入您的答案..."}
            value={userAnswer as string || ''}
            disabled={showAnalysis}
            onInput={(e) => onAnswerChange?.(e.detail.value)}
            maxlength={-1}
          />
        </View>
      )}

      {showAnalysis && (
        <View className={styles.analysis}>
          <View className={styles.ansTitle}>正确答案：</View>
          <View className={styles.ansContent}>
            <Text>{question.answer}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
