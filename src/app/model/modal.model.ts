export class Modal {
  title!: string;
  contentText!: string;
  txtBtnSuccess!: string;
  txtBtnDenied!: string;

  constructor(
    title: string = "",
    contentText: string = "",
    txtBtnSuccess: string  = "Sim",
    txtBtnDenied: string = "Não"
    ){
      this.title = title;
      this.contentText = contentText;
      this.txtBtnDenied = txtBtnDenied;
      this.txtBtnSuccess = txtBtnSuccess;
    }
}
