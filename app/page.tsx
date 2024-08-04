"use client";

import { Button, Divider, notification, Radio, Table } from "antd";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Option from "./components/Option";
import { getData, prepareQuestions } from "./helper";

const columns = [
  {
    title: "Soru Sayısı",
    dataIndex: "questionCount",
    key: "questionCount",
  },
  {
    title: "Cevap Şıkkı",
    dataIndex: "answerOption",
    key: "answerOption",
  },
  {
    title: "Cevabın İçeriği",
    dataIndex: "optionContent",
    key: "optionContent",
  },
];

const optionLabels = ["A", "B", "C", "D"];

export default function Home() {
  const [api, contextHolder] = notification.useNotification();
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [isQuizEnded, setIsQuizEnded] = useState<boolean>(false);
  const [questions, setQuestions] = useState<
    { id: number; question: string; options: string[] }[]
  >([]);
  const [selectedOption, setSelectedOption] = useState<
    | { questionCount: number; answerOption: string; optionContent: string }
    | undefined
  >(undefined);

  const [currentQuestion, setCurrentQuestion] = useState<{
    id: number;
    question: string;
    options: string[];
  }>();

  const [answers, setAnswers] = useState<
    { questionCount: number; answerOption: string; optionContent: string }[]
  >([]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    getData().then((data) => {
      setQuestions(prepareQuestions(data?.slice(0, 10)));
    });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[0]);
    }
  }, [questions]);

  useEffect(() => {
    if (count > 0) {
      const timer1 = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer1);
    } else {
      nextQuestion();
    }
  }, [count]);

  const nextQuestion = () => {
    if (selectedOption) {
      answers.push(selectedOption);
      setSelectedOption(undefined);
    }

    if (currentQuestion && currentQuestion.id === 10) {
      setIsQuizEnded(true);
      openNotification(
        "Quiz Tamamlandı",
        `Tebrikler quizi başarıyla tamamladın!`,
        "success"
      );
      return;
    }
    setCurrentQuestion(
      (currentQuestion) => questions[currentQuestion ? currentQuestion.id : 0]
    );
    setCount(30);

    if (currentQuestion) {
      openNotification(
        "Soru Değiştirildi",
        `Şuanda görüntülenen soru: ${currentQuestion.id + 1}`,
        "info"
      );
    }
  };

  const openNotification = (
    message: string,
    desc: string,
    type: "success" | "info" | "warning" | "error"
  ) => {
    api[type]({
      message: message,
      description: desc,
    });
  };

  return (
    <div>
      {contextHolder}
      {isQuizStarted ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="w-4/6 p-6 bg-slate-100 rounded-2xl shadow-lg shadow-slate-300">
            {isQuizEnded ? (
              <div>
                <p className="text-xl font-medium mb-4 text-slate-700">
                  Baykar Quiz Sonuçları
                </p>
                <Table
                  columns={columns}
                  dataSource={answers}
                  pagination={false}
                  className="shadow-md shadow-slate-200"
                />
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-slate-700">
                    Baykar Quiz
                  </p>
                  {count >= 20 && (
                    <div className="flex items-center space-x-2">
                      <Icon
                        icon="carbon:touch-1"
                        className="text-2xl text-red-400"
                      />
                      <p className="text-red-400 text-lg">00:{count - 20}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Icon
                      icon="tabler:clock"
                      className="text-3xl text-blue-500 p-1 rounded-full bg-blue-100"
                    />
                    <p className="text-blue-500 text-lg">00:{count}</p>
                  </div>
                </div>
                {currentQuestion && (
                  <div>
                    <p className="text-slate-400 font-medium mt-20">
                      Soru {currentQuestion.id}
                    </p>
                    <p className="text-slate-600 font-medium mt-2">
                      {currentQuestion.question}
                    </p>
                    <Divider className="bg-slate-100" />

                    <div className="flex-col space-y-2">
                      {currentQuestion.options.map((option, index) => {
                        return (
                          <Option
                            key={option}
                            option={optionLabels[index]}
                            optionContent={option}
                            isSelected={
                              optionLabels.indexOf(
                                selectedOption
                                  ? selectedOption.answerOption
                                  : ""
                              ) === index
                            }
                            handleOptionSelect={() => {
                              if (count >= 20) {
                                openNotification(
                                  "Cevap Seçemezsiniz",
                                  "Lütfen 10 saniyenin bitmesini bekleyiniz...",
                                  "error"
                                );
                                return;
                              }
                              setSelectedOption({
                                answerOption: optionLabels[index],
                                optionContent: option,
                                questionCount: currentQuestion.id,
                              });
                            }}
                            id={option}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-10">
                  <button
                    className="p-1.5 rounded-full bg-slate-200 flex items-center space-x-2 hover:bg-slate-300 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      nextQuestion();
                    }}
                  >
                    <p className="mx-4 text-slate-700 font-medium">
                      {currentQuestion && currentQuestion.id === 10
                        ? "Sınavı Bitir"
                        : "Sonraki Soru"}
                    </p>
                    <div className="w-10 h-10 bg-slate-300 rounded-full flex justify-center items-center">
                      <Icon
                        icon={"mingcute:right-line"}
                        className="text-slate-500 text-xl"
                      />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center items-center mt-40">
            <img src="images/welcome.png" alt="" />
          </div>
          <p className="text-3xl text-center mt-4 font-semibold text-slate-800">
            Baykar Quiz Uygulaması
          </p>
          <p className="text-base text-slate-500 text-center mt-3">
            Quize istediğiniz zaman aşağıdaki buton ile katılabilirsiniz
          </p>
          <div className="flex justify-center mt-4">
            <Button type="primary" onClick={() => {setIsQuizStarted(true); setCount(30)}}>
              <span className="font-medium">Quizi Başlat</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
