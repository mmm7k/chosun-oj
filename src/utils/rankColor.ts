// 티어 색상 결정 함수
export const rankColor = (tier: string) => {
  if (tier.startsWith('Ruby')) return '#FF1D74'; // 빨간색
  if (tier.startsWith('Diamond')) return '#21BEFC'; // 청록색
  if (tier.startsWith('Platinum')) return '#36E3AA'; // 플래티넘 은색
  if (tier.startsWith('Gold')) return '#FFD700'; // 황금색
  if (tier.startsWith('Silver')) return '#C0C0C0'; // 은색
  if (tier.startsWith('Bronze')) return '#AD5600'; // 갈색
  return '#2D2D2D'; // 청동색
};
