import { run } from "@ember/runloop";
import { apiInitializer } from "discourse/lib/api";
import { bind } from "discourse-common/utils/decorators";

export default apiInitializer("1.38.0", (api) => {
  api.modifyClass(
    "component:composer-editor",
    (Superclass) =>
      class extends Superclass {
        @bind
        setupEditor(textManipulation) {
          const result = super.setupEditor(textManipulation);

          const uppyWrapper = this.uppyComposerUpload.uppyWrapper;
          const { uppyInstance } = uppyWrapper;

          uppyInstance.on("upload", () => {
            run(() => {
              const selected = this.textManipulation.getSelected();

              if (selected.pre.includes("[grid]")) {
                this.appEvents.trigger(
                  `${this.composerEventPrefix}:apply-surround`,
                  "[grid]",
                  "[/grid]",
                  "grid_surround",
                  { useBlockMode: true }
                );
              }
            });
          });

          return result;
        }
      }
  );
});
