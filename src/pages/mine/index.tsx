import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ExamRecord } from '@/types/question';
import { getExamRecords, clearExamRecords } from '@/utils/storage';

export default function MinePage() {
  const [records, setRecords] = useState<ExamRecord[]>([]);

  useDidShow(() => {
    setRecords(getExamRecords());
  });

  const handleClear = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要清空考试记录吗？',
      success: (res) => {
        if (res.confirm) {
          clearExamRecords();
          setRecords([]);
        }
      }
    });
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <View className={styles.container}>
      <View className={styles.profile}>
        <View className={styles.avatar}>安全</View>
        <View className={styles.info}>
          <Text className={styles.name}>管理人员</Text>
          <Text className={styles.desc}>安全生产，重于泰山</Text>
        </View>
      </View>

      <View className={styles.records}>
        <View className={styles.title}>
          <Text>考试记录</Text>
          {records.length > 0 && <Text className={styles.clear} onClick={handleClear}>清空</Text>}
        </View>

        {records.length === 0 ? (
          <View className={styles.empty}>暂无考试记录</View>
        ) : (
          <View className={styles.list}>
            {records.map(record => (
              <View key={record.id} className={styles.recordItem}>
                <Text className={styles.time}>{formatDate(record.timestamp)}</Text>
                <Text className={classnames(styles.score, record.score < 60 && styles.bad)}>
                  {record.score} 分
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
