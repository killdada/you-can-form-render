let dingTalk = false;
if (/DingTalk/i.test(window.navigator.userAgent)) {
  dingTalk = true;
}

// 钉钉内部浏览器修改标题得通过他们给定的api接口,暂未接入钉钉
export function changeTitle(title: string) {
  try {
    if (dingTalk) {
      (window as any).dd.biz.navigation.setTitle({
        title, // 控制标题文本，空字符串表示显示默认文本
        onSuccess() {},
        onFail() {},
      });
    } else {
      document.title = title;
    }
  } catch (error) {
    //
  }
}
