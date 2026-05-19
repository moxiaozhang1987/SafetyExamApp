import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import QuestionCard from '@/components/QuestionCard';
import questionsData from '@/data/questions.json';
import { Question } from '@/types/question';
import { saveExamRecord, saveWrongQuestion } from '@/utils/storage';

export default function ExamPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const examType = router.params.type || 'random'; // random, single, multiple, boolean, short

  useEffect(() => {
    let list: Question[] = [];
    const allQ = questionsData as Question[];
    
    if (examType === 'random') {
      // 随机抽取20道题: 单选8, 多选5, 判断5, 简答2
      const singles = allQ.filter(q => q.type === 'single').sort(() => Math.random() - 0.5).slice(0, 8);
      const multiples = allQ.filter(q => q.type === 'multiple').sort(() => Math.random() - 0.5).slice(0, 5);
      const booleans = allQ.filter(q => q.type === 'boolean').sort(() => Math.random() - 0.5).slice(0, 5);
      const shorts = allQ.filter(q => q.type === 'short').sort(() => Math.random() - 0.5).slice(0, 2);
      list = [...singles, ...multiples, ...booleans, ...shorts];
    } else {
      list = allQ.filter(q => q.type === examType);
    }
    setQuestions(list);
  }, [examType]);

  const handleAnswerChange = (ans: string | string[]) => {
    const q = questions[currentIndex];
    setUserAnswers(prev => ({
      ...prev,
      [q.id]: ans
    }));
  };

  const checkCorrect = (q: Question, ans: string | string[]) => {
    if (q.type === 'short') return true; // 简答题不自动判分
    if (q.type === 'multiple') {
      const correctArr = q.answer.split('');
      const ansArr = Array.isArray(ans) ? ans : [];
      return correctArr.sort().join('') === ansArr.sort().join('');
    }
    return q.answer === ans;
  };

  const handleNext = () => {
    const q = questions[currentIndex];
    const ans = userAnswers[q.id];
    
    // 如果是练习模式，显示解析
    if (examType !== 'random' && !showAnalysis && q.type !== 'short') {
      if (!ans || ans.length === 0) {
        Taro.showToast({ title: '请先作答', icon: 'none' });
        return;
      }
      setShowAnalysis(true);
      const isCorrect = checkCorrect(q, ans);
      if (!isCorrect) {
        saveWrongQuestion(q);
      }
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnalysis(false);
    } else {
      finishExam();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnalysis(false);
    }
  };

  const finishExam = () => {
    let finalScore = 0;
    const records: any[] = [];
    
    questions.forEach(q => {
      const ans = userAnswers[q.id];
      const isCorrect = ans ? checkCorrect(q, ans) : false;
      
      if (!isCorrect && q.type !== 'short') {
        saveWrongQuestion(q);
      }
      
      // 每题简单算5分（满分100，20题）
      if (isCorrect && q.type !== 'short') {
        finalScore += 5; 
      }

      records.push({
        questionId: q.id,
        userAnswer: ans || '',
        isCorrect
      });
    });

    if (examType === 'random') {
      setScore(finalScore);
      saveExamRecord({
        id: Date.now().toString(),
        timestamp: Date.now(),
        score: finalScore,
        totalScore: 100, // 不算简答题的主观分
        answers: records
      });
      setIsFinished(true);
    } else {
      Taro.showToast({ title: '练习完成', icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  return (
    <View className={styles.container}>
      <View className={styles.progress}>
        <View className={styles.count}>
          <Text className={styles.current}>{currentIndex + 1}</Text> / {questions.length}
        </View>
        {examType === 'random' && (
          <View className={styles.score}>考试模式</View>
        )}
      </View>

      <QuestionCard 
        question={currentQ}
        userAnswer={userAnswers[currentQ.id]}
        showAnalysis={showAnalysis}
        onAnswerChange={handleAnswerChange}
      />

      <View className={styles.footer}>
        <Button 
          className={classnames(styles.btn, styles.outline)} 
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          上一题
        </Button>
        <Button 
          className={classnames(styles.btn, styles.primary)} 
          onClick={handleNext}
        >
          {examType !== 'random' && !showAnalysis && currentQ.type !== 'short' ? '提交并看解析' : 
            (currentIndex === questions.length - 1 ? '交卷' : '下一题')}
        </Button>
      </View>

      {isFinished && (
        <View className={styles.resultMask}>
          <View className={styles.resultCard}>
            <Text className={styles.resTitle}>考试得分</Text>
            <Text className={styles.resScore}>{score}分</Text>
            <Button className={styles.resBtn} onClick={() => Taro.navigateBack()}>返回首页</Button>
          </View>
        </View>
      )}
    </View>
  );
}
