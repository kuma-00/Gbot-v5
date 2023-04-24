//text = text.replace(this._dicPattern, (e) => this._dic[e]);

export const regExpReplaceText = (text: string, dic: { [key: string]: string }) => {
  return text.replace(/(\{.*?\})/g, (e) => dic[e]);
}