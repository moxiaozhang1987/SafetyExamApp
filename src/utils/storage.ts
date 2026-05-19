import Taro from '@tarojs/taro';
import { Question, ExamRecord } from '../types/question';

const WRONG_QUESTIONS_KEY = 'safety_wrong_questions';
const EXAM_RECORDS_KEY = 'safety_exam_records';

export const getWrongQuestions = (): Question[] => {
  return Taro.getStorageSync(WRONG_QUESTIONS_KEY) || [];
};

export const saveWrongQuestion = (question: Question) => {
  const wrongs = getWrongQuestions();
  const exists = wrongs.find(q => q.id === question.id);
  if (!exists) {
    wrongs.push(question);
    Taro.setStorageSync(WRONG_QUESTIONS_KEY, wrongs);
  }
};

export const removeWrongQuestion = (questionId: number) => {
  const wrongs = getWrongQuestions();
  const filtered = wrongs.filter(q => q.id !== questionId);
  Taro.setStorageSync(WRONG_QUESTIONS_KEY, filtered);
};

export const getExamRecords = (): ExamRecord[] => {
  return Taro.getStorageSync(EXAM_RECORDS_KEY) || [];
};

export const saveExamRecord = (record: ExamRecord) => {
  const records = getExamRecords();
  records.unshift(record); // put latest at top
  Taro.setStorageSync(EXAM_RECORDS_KEY, records);
};

export const clearExamRecords = () => {
  Taro.removeStorageSync(EXAM_RECORDS_KEY);
};
