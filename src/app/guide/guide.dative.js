import Dative from "dativejs";
import template from "./guide.md";

export let Guide = Dative.extend({
  template: `<div class="bg-base-200">
    <div id="nav"></div>
        <div class="prose prose-lg sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto min-h-screen prose-blue mt-5">
            <div class="mx-3">
            ${template}
            </div>
        </div>
        <div id="footer"></div>
    </div>`
});
