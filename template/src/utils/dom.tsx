/**
 * 判断当前是否全屏
 */
export const isFullScreen = () => {
  const myDoc: any = document;
  return !!(
    myDoc.fullscreen ||
    myDoc.mozFullscreen ||
    myDoc.webkitIsFullscreen ||
    myDoc.webkitFullscreen ||
    myDoc.msFullscreen
  );
};

/**
 * 切换全屏
 * @param dom
 */
export const toggleFullScreen = (dom: HTMLElement | null | undefined, fullscreen?: boolean) => {
  if (dom) {
    if (fullscreen ?? isFullScreen()) {
      document.exitFullscreen();
    } else {
      dom.requestFullscreen();
    }
  }
};
