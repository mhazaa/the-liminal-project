const isMobileOrTablet = (): boolean => {
	// @ts-expect-error
	if (navigator.userAgentData) return navigator.userAgentData.mobile;

	const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i;
	if (regex.test(navigator.userAgent)) return true;
  
	const isIpadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
	return isIpadOS;
};

export default isMobileOrTablet;