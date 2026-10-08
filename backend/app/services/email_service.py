import os
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, Optional
from flask import current_app
from ..utils.logger import logger

class EmailService:
    def __init__(self):
        pass

    def _build_html_email(self, title: str, subtitle: str, fields: Dict[str, str], button_url: Optional[str] = None) -> str:
        fields_html = "".join(
            f"""
            <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 14px; font-weight: 500;">{k}</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #1e293b; color: #f8fafc; font-size: 14px; font-weight: 600;">{v}</td>
            </tr>
            """
            for k, v in fields.items()
        )
        
        button_html = f"""
        <div style="margin-top: 24px; text-align: center;">
            <a href="{button_url}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                View Task in Hairdrama Tech
            </a>
        </div>
        """ if button_url else ""

        return f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #f8fafc;">
            <div style="max-width: 560px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: left;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Hairdrama Tech</h1>
                    <p style="margin: 4px 0 0 0; color: #e0e7ff; font-size: 14px;">{title}</p>
                </div>
                <div style="padding: 24px;">
                    <p style="color: #cbd5e1; font-size: 15px; margin-top: 0; line-height: 1.5;">{subtitle}</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                        {fields_html}
                    </table>
                    {button_html}
                </div>
                <div style="background-color: #0b0f19; padding: 16px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
                    Hairdrama Tech Task Management System &bull; Automated Notification
                </div>
            </div>
        </body>
        </html>
        """

    def send_task_assigned_email(
        self,
        recipient_email: str,
        recipient_name: str,
        task: Dict[str, Any],
        creator_name: str
    ) -> bool:
        """
        Two required emails (Section 16):
        Subject: You have been assigned a new task
        Task: <title>
        Priority: <priority>
        Due: <due_date>
        Created by: <creator>
        """
        subject = f"You have been assigned a new task: {task['title']}"
        due_str = task.get("due_date") or "No due date specified"
        
        text_body = f"""
Hello {recipient_name},

You have been assigned a new task in Hairdrama Tech.

Task: {task['title']}
Priority: {task.get('priority', 'MEDIUM')}
Due: {due_str}
Created by: {creator_name}

Description:
{task.get('description', 'No description provided')}
        """.strip()

        frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
        task_url = f"{frontend_url}/tasks/{task['id']}"

        fields = {
            "Task": task["title"],
            "Priority": task.get("priority", "MEDIUM"),
            "Due Date": due_str,
            "Created By": creator_name,
        }
        html_body = self._build_html_email(
            title="New Task Assignment",
            subtitle=f"Hello <strong>{recipient_name}</strong>, you have been assigned a new task by <strong>{creator_name}</strong>.",
            fields=fields,
            button_url=task_url
        )

        return self._send_email(
            recipient_email=recipient_email,
            subject=subject,
            text_body=text_body,
            html_body=html_body
        )

    def send_task_completed_email(
        self,
        recipient_email: str,
        recipient_name: str,
        task: Dict[str, Any],
        completed_by_name: str,
        completed_at: str
    ) -> bool:
        """
        Two required emails (Section 16):
        Subject: Task completed: <title>
        Completed by: <completer>
        Completed at: <timestamp>
        """
        subject = f"Task completed: {task['title']}"
        text_body = f"""
Hello {recipient_name},

A task you created has been marked as completed.

Task: {task['title']}
Completed by: {completed_by_name}
Completed at: {completed_at}
        """.strip()

        frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
        task_url = f"{frontend_url}/tasks/{task['id']}"

        fields = {
            "Task": task["title"],
            "Completed By": completed_by_name,
            "Completed At": completed_at,
            "Priority": task.get("priority", "MEDIUM"),
        }
        html_body = self._build_html_email(
            title="Task Completed",
            subtitle=f"Hello <strong>{recipient_name}</strong>, task <strong>{task['title']}</strong> was completed by <strong>{completed_by_name}</strong>.",
            fields=fields,
            button_url=task_url
        )

        return self._send_email(
            recipient_email=recipient_email,
            subject=subject,
            text_body=text_body,
            html_body=html_body
        )

    def _send_email(
        self,
        recipient_email: str,
        subject: str,
        text_body: str,
        html_body: str
    ) -> bool:
        """
        Attempts dispatch via Gmail API if OAuth/Service credentials configured,
        or logs cleanly to console if offline/demo environment (Section 17 resilience).
        """
        sender_email = current_app.config.get("GMAIL_SENDER_EMAIL", "notifications@hairdrama.tech")
        client_id = current_app.config.get("GMAIL_CLIENT_ID", "")
        refresh_token = current_app.config.get("GMAIL_REFRESH_TOKEN", "")

        # Always log email action for auditing and local testing verification
        logger.info(f"[Email Service] Sending Email to: {recipient_email} | Subject: '{subject}'")

        if not client_id or not refresh_token:
            logger.info(
                f"[Email Service Simulator] Gmail API credentials not set. "
                f"Simulating delivery for '{subject}' to {recipient_email}:\n{text_body}"
            )
            return True

        try:
            # Gmail API Dispatch
            from google.oauth2.credentials import Credentials
            from googleapiclient.discovery import build

            creds = Credentials(
                token=None,
                refresh_token=refresh_token,
                client_id=client_id,
                client_secret=current_app.config.get("GMAIL_CLIENT_SECRET", ""),
                token_uri="https://oauth2.googleapis.com/token"
            )
            service = build("gmail", "v1", credentials=creds)

            message = MIMEMultipart("alternative")
            message["to"] = recipient_email
            message["from"] = sender_email
            message["subject"] = subject

            part1 = MIMEText(text_body, "plain")
            part2 = MIMEText(html_body, "html")
            message.attach(part1)
            message.attach(part2)

            raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
            service.users().messages().send(userId="me", body={"raw": raw}).execute()
            logger.info(f"[Email Service] Successfully dispatched email via Gmail API to {recipient_email}")
            return True
        except Exception as exc:
            # Resilient error handling per Section 17:
            # Log failure, do NOT raise or crash task workflow!
            logger.error(f"[Email Service Warning] Failed to dispatch email via Gmail API: {exc}")
            return False

email_service = EmailService()
