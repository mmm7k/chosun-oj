 # Chosun Online Judge System

> **실시간 저지 및 웹 IDE를 갖춘 온라인 저지 시스템** <br/> **개발기간: 2024.09 ~ 2024.12** <br/> **프론트엔드 1명, 백엔드 3명** <br/> **사용 기술 <br/> - Next.js (ver.14) <br/> - TypeScript <br/> - TailWind CSS <br/> - Zustand <br/> - react-query(v.5)**  


## 배포 주소
> [https://felis.chosun.ac.kr](https://felis.chosun.ac.kr)

---

## 프로젝트 소개

조선대학교 온라인 저지 시스템은 학생, 교수, 관리자용 페이지를 포함한 **종합 온라인 저지 플랫폼**입니다.<br/> 웹 기반의 **IDE**를 통해 코드 작성 및 실시간 컴파일이 가능하며, 과제 제출, 대회 참여, Q&A, 공지사항 확인, 랭킹 시스템을 제공합니다.<br/> 모든 CRUD 기능은 React Query를 사용해 **효율적으로 최적화**되었으며, 로그인상태를 **Zustand를 통해 전역으로 관리**하였습니다.<br/> 2025년 일부 프로그래밍 수업에 실 사용 예정이며 현재 교내 베타테스트 진행 중입니다.

---

## 아키텍처

![image](https://github.com/user-attachments/assets/8ce90164-5820-466b-b8df-d6f84d5b5ec2)

---

## 주요 기능 📦

### ⭐️ 실시간 웹 IDE 및 컴파일러

- 웹에서 코드를 작성하고 제출하면 실시간으로 컴파일 결과를 확인할 수 있습니다.
- 다양한 프로그래밍 언어를 지원하며, 사용자 친화적인 UI/UX를 제공합니다.
<img src="https://github.com/user-attachments/assets/3486e0f3-00b2-412d-a2ca-4c66cfeaae04" width="70%" height="35%"/>


### ⭐️ 문제
- 교수와 관리자가 등록한 문제를 학생들이 필터링 및 검색하여 풀 수 있습니다.
<img src="https://github.com/user-attachments/assets/b4d501d9-aeba-4816-9993-85bfb6720311" width="70%" height="35%"/>

---

### ⭐️ 학생, 교수, 관리자 전용 페이지

- **학생 페이지**: 과제 제출, 랭킹 확인, 대회 참여, 공지사항 확인 등.
<img src="https://github.com/user-attachments/assets/54d117cb-85fa-4876-8768-c19b97b1cf55" width="70%" height="35%"/>

- **교수 페이지**: 과제 및 대회 관리, 학생 관리 기능.
<img src="https://github.com/user-attachments/assets/52d52dd5-a694-418d-91fa-3862f6b34b04" width="70%" height="35%"/>

- **관리자 페이지**: 시스템 전반 관리 및 데이터 모니터링.
<img src="https://github.com/user-attachments/assets/a2c5abc6-b403-4815-9d41-9fd6c10b4d23" width="70%" height="35%"/>
---

### ⭐️ 랭킹 시스템

- 학생들의 저지 시스템 활동에 따라 실시간으로 랭킹이 업데이트됩니다.
- 랭킹은 획득 점수를 기준으로 산정됩니다.
<img src="https://github.com/user-attachments/assets/da977a9a-86c6-4767-8a13-992959ff3d8b" width="70%" height="35%"/>

---

### ⭐️ Q&A 및 공지사항 페이지

- **Q&A**: 학생 및 교수 간 질문 및 답변을 주고받을 수 있는 페이지.
- **공지사항**: 과제, 대회 등과 관련된 최신 공지를 확인 가능합니다.
<img src="https://github.com/user-attachments/assets/f19728ab-88e3-45cd-b761-4ec13384c9b8" width="70%" height="35%"/>
<img src="https://github.com/user-attachments/assets/527a558c-36dd-43a4-a575-81a3cdf1085b" width="70%" height="35%"/>

---

## 트러블 슈팅 💡

##  API 요청 병렬 처리를 통한 네트워크 성능 최적화 ✔

### 문제 배경

기존에는 API 요청들이 순차적으로 호출되어 각 요청이 완료될 때까지 대기해야 했습니다. 이로 인해 총 API 요청 시간이 354.12ms에 달하며 성능 저하가 발생했습니다.

### 해결 방법

React Query를 도입하여 독립적인 API 요청들을 병렬 처리하고, 자동 캐싱 및 재검증 기능을 활용하여 네트워크 요청을 최적화했습니다.

### 결과
<img src="https://github.com/user-attachments/assets/b7ec1e20-e114-4b67-9106-38b4ddfd7aec" width="70%" height="35%"/> <br/> <br/>
기존 354.12ms가 소요되던 API 요청 시간이 약 67% 단축되어 115.71ms로 개선되었고, 페이지 로딩 속도가 크게 향상되었습니다.


##  웹 IDE 한글이 포함된 코드 실행 문제 ✔

### 문제 배경

웹 IDE에서 작성된 코드에 한글이 포함될 경우, 코드가 정상적으로 실행되지 않는 문제가 발생했습니다.

### 해결 방법

Base64로 코드를 인코딩하여 서버에 전송한 뒤, 실행 결과를 디코딩하여 사용자에게 반환하는 방식을 도입했습니다.

---

## 시작 가이드

### Requirements

- Node.js
- npm

### Installation

```bash
$ git clone https://github.com/mmm7k/chosun-oj.git
$ npm install
$ npm run dev
