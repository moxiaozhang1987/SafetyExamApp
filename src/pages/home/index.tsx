import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

export default function HomePage() {
  const startExam = (type: string) => {
    Taro.navigateTo({
      url: `/pages/exam/index?type=${type}`
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>安全专项考核题库</Text>
        <Text className={styles.subtitle}>全面提升安全管理人员专业水平</Text>
      </View>

      <View className={styles.banner}>
        <Text className={styles.bannerTitle}>模拟考试</Text>
        <Text className={styles.bannerDesc}>随机抽取20道题进行模拟考核</Text>
        <Button className={styles.btn} onClick={() => startExam('random')}>开始考核</Button>
      </View>

      <View className={styles.grid}>
        <View className={styles.card} onClick={() => startExam('single')}>
          <View className={styles.iconBox}><Text className={styles.iconTxt}>单</Text></View>
          <Text className={styles.cardTitle}>单选题练习</Text>
          <Text className={styles.cardDesc}>共35道单选题</Text>
        </View>

        <View className={styles.card} onClick={() => startExam('multiple')}>
          <View className={styles.iconBox}><Text className={styles.iconTxt}>多</Text></View>
          <Text className={styles.cardTitle}>多选题练习</Text>
          <Text className={styles.cardDesc}>共35道多选题</Text>
        </View>

        <View className={styles.card} onClick={() => startExam('boolean')}>
          <View className={styles.iconBox}><Text className={styles.iconTxt}>判</Text></View>
          <Text className={styles.cardTitle}>判断题练习</Text>
          <Text className={styles.cardDesc}>共35道判断题</Text>
        </View>

        <View className={styles.card} onClick={() => startExam('short')}>
          <View className={styles.iconBox}><Text className={styles.iconTxt}>简</Text></View>
          <Text className={styles.cardTitle}>简答题练习</Text>
          <Text className={styles.cardDesc}>共10道简答题</Text>
        </View>
      </View>
    </View>
  );
}
