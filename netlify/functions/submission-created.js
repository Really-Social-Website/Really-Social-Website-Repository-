// Sends Curry Club Christmas form submissions to monday.com.
// Netlify runs this automatically on its built-in `submission-created` event.
// Requires the MONDAY_API_TOKEN environment variable (set in Netlify, never in code).

const MONDAY_API_URL = 'https://api.monday.com/v2';
const BOARD_ID = '18433717704'; // Leads 2026
const GROUP_ID = 'topics'; // Active Leads

// Only these forms are sent to monday.com. Every other form is ignored.
const FORMS = {
  'curry-club-christmas': { page: 'Main', source: 'Website' },
  'curry-club-christmas-curry-life': { page: 'Curry Life', source: 'Referral - Curry Life' },
  'curry-club-christmas-favouritetable': { page: 'Favouritetable', source: 'Referral - Favouritetable' },
};

const MUTATION = `
  mutation ($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
    create_item(
      board_id: $boardId
      group_id: $groupId
      item_name: $itemName
      column_values: $columnValues
      create_labels_if_missing: true
    ) {
      id
    }
  }
`;

const clean = (value) => (value == null ? '' : String(value).trim());

exports.handler = async (event) => {
  try {
    const { payload = {} } = JSON.parse(event.body || '{}');
    const formName = payload.form_name;
    const form = FORMS[formName];

    if (!form) {
      return { statusCode: 200, body: 'Ignored' };
    }

    const token = process.env.MONDAY_API_TOKEN;
    if (!token) {
      console.error('MONDAY_API_TOKEN is not set; skipping monday.com for', formName);
      return { statusCode: 200, body: 'OK' };
    }

    const data = payload.data || {};
    const submitted = new Date(payload.created_at || Date.now());
    const when = isNaN(submitted) ? new Date() : submitted;
    const [date, time] = when.toISOString().split('T');

    const columnValues = {
      text_mm7rmn2f: clean(data.name),
      text_mm7rg0z9: clean(data.phone),
      text_mm7re023: clean(data.email),
      text_mm7rgcb6: `Curry Club Christmas – ${form.page} page. Town: ${clean(data.location)}`,
      date4: { date, time: time.slice(0, 8) },
      status: { label: 'New Lead' },
      dropdown_mm7rbtn4: { labels: [form.source] },
    };

    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'API-Version': '2024-10',
      },
      body: JSON.stringify({
        query: MUTATION,
        variables: {
          boardId: BOARD_ID,
          groupId: GROUP_ID,
          itemName: clean(data.restaurant) || 'Unnamed restaurant',
          columnValues: JSON.stringify(columnValues),
        },
      }),
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || !result || result.errors || result.error_message) {
      console.error('monday.com error', response.status, JSON.stringify(result));
    } else {
      console.log('monday.com item created', result.data.create_item.id, 'from', formName);
    }
  } catch (error) {
    console.error('submission-created failed', error);
  }

  // Always 200 so a monday.com problem never breaks the form for visitors.
  return { statusCode: 200, body: 'OK' };
};
