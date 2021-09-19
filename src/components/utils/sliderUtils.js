export function getPositionX(event) {
  // return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  return event.type.includes('mouse')
    ? event.pageX
    : event.touches[0].clientX * 2;
}
