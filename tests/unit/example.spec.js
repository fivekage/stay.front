import { mount } from "@vue/test-utils";

import DirectLink from "@/views/DirectLink.vue";

describe("Direct Link", () => {
  it("renders should work", () => {
    const wrapper = mount(DirectLink);
    const title = wrapper.get("h5");

    expect(title.text()).toBe("Liens Directs");
  });
});
