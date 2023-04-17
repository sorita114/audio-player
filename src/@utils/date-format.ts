const dateFormat = (date: string|number, langCode = 'ko-KR', options?: Intl.DateTimeFormatOptions): string => {
  try {
    const convertToDate = new Date(date);
    return convertToDate.toLocaleString(langCode, options || {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (e) {
    console.log(e);
    return ''
  }
}

export default dateFormat;