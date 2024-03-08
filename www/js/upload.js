var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Snackbar } from './snackbar.js';
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
export const dropContainer = `
  <div id="drop-container">
    <p>
      <b>Drop Here</b>
      <br>
        <ul>
          <li>STACK_NAME.stack.yml</li>
          <li>stack.STACK_NAME.yml</li>
          <li>SECRET_NAME.txt</li>
          <li>SECRET_NAME.json</li>
        </ul>
    </p>
  </div>
  <!-- <input type="file" id="file-input" /> -->
`;
export const dropContainerInit = () => {
    // const fileInput = document.getElementById('file-input') as HTMLInputElement
    // if (!fileInput) return
    const container = document.getElementById('drop-container');
    if (!container)
        return;
    container.addEventListener('drop', (event) => {
        var _a;
        event.preventDefault();
        if (!((_a = event === null || event === void 0 ? void 0 : event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0]))
            return;
        new Snackbar(`Uploading. Please wait...`);
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            const file = event.dataTransfer.files[i];
            const name = file.name;
            const reader = new FileReader();
            reader.onload = (event) => __awaiter(void 0, void 0, void 0, function* () {
                var _b;
                if ((_b = event === null || event === void 0 ? void 0 : event.target) === null || _b === void 0 ? void 0 : _b.result) {
                    const result = yield fetch('/upload', {
                        // const result = await fetch('/secret/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, stack: event.target.result, secret: event.target.result })
                    });
                    const json = yield result.json();
                    const messages = json.msg.replace(/\n$/, '').split('\n');
                    messages.forEach(m => {
                        if (result.status === 200)
                            new Snackbar(m);
                        console.log('=> ', m);
                    });
                    if (result.status !== 200)
                        new Snackbar(`${name}: ${messages[messages.length - 1]}`);
                    // remove dropbox
                    const box = document.getElementById('drop-wrapper');
                    if (box)
                        box.classList.add('is-hidden');
                }
            });
            reader.readAsText(file);
        }
    });
    container.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
    container.addEventListener('dragenter', (event) => {
        event.preventDefault();
        container.classList.toggle('over');
    });
    container.addEventListener('dragleave', (event) => {
        event.preventDefault();
        container.classList.toggle('over');
    });
};
const main = () => {
    // --black: #0c0e14;
    // --white: #f8f8f2;
    const style = document.createElement('style');
    style.innerText = /* css */ `
  #drop-wrapper { position: fixed; top: 33%; left: 50%; transform: translate(-50%, -50%); z-index: 999; }
  #drop-container { box-sizing: border-box; padding: 16px; font-size: 18px; color: #f8f8f2; background: #0c0e14e0; border-radius: 5px; width:280px; height:200px; border: 10px dashed #f8f8f2; text-align: center; vertical-align: middle; }
  #drop-container.over { background:#6272a4e0; }
  #drop-container li { line-height: 1.6; font-size: 12px; }
  `;
    document.body.prepend(style);
    const div = document.createElement('div');
    div.id = 'drop-wrapper';
    div.classList.add('is-hidden');
    div.innerHTML = dropContainer;
    document.body.prepend(div);
    dropContainerInit();
};
main();
