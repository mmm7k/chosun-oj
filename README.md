# Chosun Online Judge System

> **실시간 저지 및 웹 IDE를 갖춘 온라인 저지 시스템** <br/> **개발기간: 2024.09 ~ 2024.12** <br/> **프론트엔드 1명, 백엔드 3명** <br/> **배포: 자체 서버 (http://chosuncnl.shop:5555)** <br/> **사용 기술 <br/> - Next.js (ver.14) <br/> - TypeScript <br/> - TailWind CSS <br/> - Zustand <br/> - react-query(v.5)**  

---

## 프로젝트 소개

조선대학교 온라인 저지 시스템은 학생, 교수, 관리자용 페이지를 포함한 **종합 온라인 저지 플랫폼**입니다. 웹 기반의 **IDE**를 통해 코드 작성 및 실시간 컴파일이 가능하며, 과제 제출, 대회 참여, Q&A, 공지사항 확인, 랭킹 시스템을 제공합니다. 모든 CRUD 기능은 React Query를 사용해 **효율적으로 최적화**되었으며, 로그인상태를 **Zustand를 통해 전역으로 관리**하였습니다.

---

## 아키텍처

![image](https://github.com/user-attachments/assets/b2f7e129-af2b-43c9-abe0-ae408b8efdf6)

---

## 주요 기능 📦

### ⭐️ 실시간 웹 IDE 및 컴파일러

- 웹에서 코드를 작성하고 제출하면 실시간으로 컴파일 결과를 확인할 수 있습니다.
- 다양한 프로그래밍 언어를 지원하며, 사용자 친화적인 UI/UX를 제공합니다.
- <img src="https://github.com/user-attachments/assets/3486e0f3-00b2-412d-a2ca-4c66cfeaae04" width="70%" height="35%"/>


---

### ⭐️ 학생, 교수, 관리자 전용 페이지

- **학생 페이지**: 과제 제출, 랭킹 확인, 대회 참여, 공지사항 확인 등.
- <img src="https://github.com/user-attachments/assets/1fe7a90a-d052-4749-8d27-f22a806bdfd6" width="70%" height="35%"/>

- **교수 페이지**: 과제 및 대회 관리, 학생 관리 기능.
- <img src="https://github.com/user-attachments/assets/52d52dd5-a694-418d-91fa-3862f6b34b04" width="70%" height="35%"/>

- **관리자 페이지**: 시스템 전반 관리 및 데이터 모니터링.
- <img src="https://github.com/user-attachments/assets/a2c5abc6-b403-4815-9d41-9fd6c10b4d23" width="70%" height="35%"/>
---

### ⭐️ 랭킹 시스템

- 학생들의 저지 시스템 활동에 따라 실시간으로 랭킹이 업데이트됩니다.
- 랭킹은 획득 점수를 기준으로 산정됩니다.
- <img src="https://github.com/user-attachments/assets/da977a9a-86c6-4767-8a13-992959ff3d8b" width="70%" height="35%"/>

---

### ⭐️ Q&A 및 공지사항 페이지

- **Q&A**: 학생 및 교수 간 질문 및 답변을 주고받을 수 있는 페이지.
- **공지사항**: 과제, 대회 등과 관련된 최신 공지를 확인 가능합니다.
- <img src="https://github.com/user-attachments/assets/f19728ab-88e3-45cd-b761-4ec13384c9b8" width="70%" height="35%"/>
- <img src="https://github.com/user-attachments/assets/527a558c-36dd-43a4-a575-81a3cdf1085b" width="70%" height="35%"/>

---

### ⭐️ 대회 및 과제 관리

- 대회: 학생들이 대회에 참여하여 문제를 해결할 수 있도록 설계되었습니다.
- 과제: 교수 페이지에서 과제를 생성 및 관리하고, 학생은 제출할 수 있습니다.
- <img src="https://github.com/user-attachments/assets/62e5c214-6d6d-4623-90dc-f40147ea2384" width="70%" height="35%"/>
- <img src="https://github.com/user-attachments/assets/f948f407-881d-4b52-918c-7570b28258d6" width="70%" height="35%"/>


---

## 트러블 슈팅 💡


---

## 시작 가이드

### Requirements

- Node.js
- npm

### Installation

```bash
$ git clone https://github.com/mmm7k/chosun-judge.git
$ npm install
$ npm run dev
