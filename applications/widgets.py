from django import forms
from django.utils.safestring import mark_safe
import json

class QuillAdminWidget(forms.Textarea):
    class Media:
        css = {
            'all': (
                'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css',
            )
        }
        js = (
            'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js',
        )

    def render(self, name, value, attrs=None, renderer=None):
        attrs = attrs or {}
        final_attrs = self.build_attrs(self.attrs, attrs)
        widget_id = final_attrs.get('id', f'id_{name}')
        quill_id = f'quill_{widget_id}'
        value_str = value or ''

        # Render hidden textarea that Django forms submit
        textarea_html = super().render(name, value, {**final_attrs, 'style': 'display:none;'})

        html = f"""
        <div class="quill-admin-wrapper w-full mb-3" style="max-width: 100%;">
            {textarea_html}
            <div id="{quill_id}" class="bg-white text-slate-800 rounded-b-md" style="min-height: 160px; font-size: 14px;"></div>
        </div>
        <style>
            .quill-admin-wrapper .ql-toolbar.ql-snow {{
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                border-color: #cbd5e1;
                background-color: #f8fafc;
            }}
            .quill-admin-wrapper .ql-container.ql-snow {{
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
                border-color: #cbd5e1;
                background-color: #ffffff;
                font-family: inherit;
            }}
            .dark .quill-admin-wrapper .ql-toolbar.ql-snow {{
                background-color: #1e293b;
                border-color: #334155;
            }}
            .dark .quill-admin-wrapper .ql-toolbar.ql-snow .ql-stroke {{
                stroke: #94a3b8;
            }}
            .dark .quill-admin-wrapper .ql-toolbar.ql-snow .ql-fill {{
                fill: #94a3b8;
            }}
            .dark .quill-admin-wrapper .ql-toolbar.ql-snow .ql-picker {{
                color: #94a3b8;
            }}
            .dark .quill-admin-wrapper .ql-container.ql-snow {{
                background-color: #0f172a;
                border-color: #334155;
                color: #f1f5f9;
            }}
            .dark .quill-admin-wrapper .ql-editor.ql-blank::before {{
                color: #64748b;
            }}
        </style>
        <script>
        (function() {{
            function setupQuill() {{
                if (typeof Quill === 'undefined') {{
                    setTimeout(setupQuill, 60);
                    return;
                }}
                var container = document.getElementById('{quill_id}');
                var textarea = document.getElementById('{widget_id}');
                if (!container || container.dataset.initialized === 'true') return;
                container.dataset.initialized = 'true';

                var quill = new Quill(container, {{
                    theme: 'snow',
                    modules: {{
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{{ 'list': 'ordered' }}, {{ 'list': 'bullet' }}],
                            ['link'],
                            ['clean']
                        ]
                    }}
                }});

                if (textarea.value) {{
                    quill.root.innerHTML = textarea.value;
                }}

                function syncVal() {{
                    var html = quill.root.innerHTML;
                    if (html === '<p><br></p>' || html === '<p></p>' || html.trim() === '') {{
                        textarea.value = '';
                    }} else {{
                        textarea.value = html;
                    }}
                }}

                quill.on('text-change', syncVal);

                var form = textarea.closest('form');
                if (form) {{
                    form.addEventListener('submit', syncVal);
                }}
            }}

            if (document.readyState === 'loading') {{
                document.addEventListener('DOMContentLoaded', setupQuill);
            }} else {{
                setupQuill();
            }}
        }})();
        </script>
        """
        return mark_safe(html)
