export default {
  async beforeCreate(event: any) {
    // debug
    // console.log('>>> newsletter beforeCreate', event.params.data);

    const { data } = event.params;

    if (!data.subscribed_at) {
      data.subscribed_at = new Date();
    }

    if (typeof data.gdpr_accepted === 'undefined') {
      data.gdpr_accepted = true;
    }
    if (typeof data.unsubscribed === 'undefined') {
      data.unsubscribed = false;
    }
    if (typeof data.confirmed === 'undefined') {
      data.confirmed = false;
    }
  },
};