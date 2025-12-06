// backend/src/api/contact/content-types/contact/lifecycles.ts

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;

    // Név, email, message alap dolgok – ha nagyon akarod, itt is lehet sanity check
    if (!data.name) {
      // ide rakhatsz logot vagy akár hibát is dobhatnál
      // throw new Error('Name is required');
    }

    // STATE enum (new / in_progress / done)
    if (!data.state) {
      data.state = 'new';
    }

    // language – ha frontend nem küld, default legyen hu
    if (!data.language) {
      data.language = 'hu';
    }

    // page – ha nincs, akkor legalább valami default
    if (!data.page) {
      data.page = 'unknown';
    }

    // ide később betehetünk email küldést is, ha akarsz
    // pl. notification adminnak
  },

  async beforeUpdate(event: any) {
    const { data } = event.params;

    // ide pakolhatsz logikát, ha pl. state váltáskor akarsz valamit
    // pl. ha state "done"-ra kerül, küldj follow-up emailt, stb.
  },
};
