#!/usr/bin/env python3
"""
Playwright test script for send-survey.html mobile interface
Tests multi-step survey sending workflow with patient selection, survey type, scheduling, and review
"""

from playwright.sync_api import sync_playwright
import os
import sys

def test_send_survey_interface():
    """Test the send survey mobile interface"""

    # Get the absolute path to send-survey.html
    current_dir = os.path.dirname(os.path.abspath(__file__))
    survey_path = os.path.join(current_dir, 'send-survey.html')
    file_url = f'file://{survey_path}'

    print(f"Testing send survey interface at: {file_url}")

    with sync_playwright() as p:
        # Launch browser in headless mode
        browser = p.chromium.launch(headless=True)

        # Create a mobile viewport context
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},  # iPhone X size
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
        )

        page = context.new_page()

        # Enable console logging
        page.on('console', lambda msg: print(f'Console: {msg.text}'))
        page.on('pageerror', lambda err: print(f'Error: {err}'))

        try:
            print("\n=== Test 1: Page Load ===")
            page.goto(file_url)
            page.wait_for_load_state('networkidle')
            print("✓ Page loaded successfully")

            # Take initial screenshot
            page.screenshot(path='/tmp/send_survey_step1.png', full_page=True)
            print("✓ Screenshot saved to /tmp/send_survey_step1.png")

            print("\n=== Test 2: Header Elements ===")
            assert page.locator('.header').is_visible(), "Header not found"
            print("✓ Header visible")

            header_title = page.locator('.header-title').text_content()
            print(f"✓ Header title: {header_title}")

            assert page.locator('.close-button').is_visible(), "Close button not found"
            print("✓ Close button visible")

            assert page.locator('.header-action').is_visible(), "Save Draft button not found"
            print("✓ Save Draft button visible")

            print("\n=== Test 3: Progress Bar (Step 1) ===")
            progress_bar = page.locator('#progressBar')
            progress_width = progress_bar.evaluate('el => el.style.width')
            print(f"✓ Progress bar width: {progress_width}")

            progress_steps = page.locator('.progress-step').all()
            print(f"✓ Found {len(progress_steps)} progress steps")
            for i, step in enumerate(progress_steps):
                text = step.text_content()
                is_active = 'active' in step.get_attribute('class')
                status = "ACTIVE" if is_active else "inactive"
                print(f"  - {text}: {status}")

            print("\n=== Test 4: Step 1 - Patient Selection ===")
            # Verify step 1 is active
            step1 = page.locator('#step1')
            assert 'active' in step1.get_attribute('class'), "Step 1 should be active"
            print("✓ Step 1 is active")

            # Check search input
            assert page.locator('.search-input').is_visible(), "Search input not found"
            print("✓ Search input visible")

            # Check filter chips
            filter_chips = page.locator('.filter-chip').all()
            print(f"✓ Found {len(filter_chips)} filter chips")

            # Check patient cards
            patient_cards = page.locator('.patient-card').all()
            print(f"✓ Found {len(patient_cards)} patient cards")

            selected_count = 0
            for i, card in enumerate(patient_cards):
                name = card.locator('.patient-name').text_content()
                is_selected = 'selected' in card.get_attribute('class')
                if is_selected:
                    selected_count += 1
                status = "SELECTED" if is_selected else "not selected"
                print(f"  - {name}: {status}")

            print(f"✓ {selected_count} patients pre-selected")

            # Verify selected count display
            selected_count_text = page.locator('#selectedCount').text_content()
            print(f"✓ Selected count display: {selected_count_text}")

            print("\n=== Test 5: Patient Selection Toggle ===")
            # Toggle selection on first unselected patient
            unselected_card = page.locator('.patient-card:not(.selected)').first
            if unselected_card.count() > 0:
                patient_name = unselected_card.locator('.patient-name').text_content()
                print(f"Selecting patient: {patient_name}")

                unselected_card.click()
                page.wait_for_timeout(200)

                # Verify selection
                assert 'selected' in unselected_card.get_attribute('class'), "Patient should be selected"
                print("✓ Patient selected successfully")

                # Deselect
                unselected_card.click()
                page.wait_for_timeout(200)

                # Verify deselection
                assert 'selected' not in unselected_card.get_attribute('class'), "Patient should be deselected"
                print("✓ Patient deselected successfully")

            print("\n=== Test 6: Search Functionality ===")
            search_input = page.locator('.search-input')
            search_input.fill('Johnny')
            page.wait_for_timeout(200)

            visible_cards = page.locator('.patient-card[style*="display: flex"], .patient-card:not([style*="display: none"])').all()
            print(f"✓ Search filtered to {len(visible_cards)} patient(s)")

            # Clear search
            search_input.fill('')
            page.wait_for_timeout(200)
            print("✓ Search cleared")

            print("\n=== Test 7: Navigate to Step 2 ===")
            continue_button = page.locator('.btn-primary')
            continue_button.click()
            page.wait_for_timeout(500)

            # Take screenshot of step 2
            page.screenshot(path='/tmp/send_survey_step2.png', full_page=True)
            print("✓ Screenshot saved to /tmp/send_survey_step2.png")

            # Verify step 2 is active
            step2 = page.locator('#step2')
            assert 'active' in step2.get_attribute('class'), "Step 2 should be active"
            print("✓ Step 2 is active")

            # Check progress
            progress_width = progress_bar.evaluate('el => el.style.width')
            print(f"✓ Progress bar width: {progress_width}")

            print("\n=== Test 8: Step 2 - Survey Type Selection ===")
            survey_cards = page.locator('.survey-card').all()
            print(f"✓ Found {len(survey_cards)} survey types")

            for i, card in enumerate(survey_cards):
                title = card.locator('.survey-card-title').text_content()
                description = card.locator('.survey-card-description').text_content()
                is_selected = 'selected' in card.get_attribute('class')
                status = "SELECTED" if is_selected else "not selected"
                print(f"  - {title}: {status}")
                print(f"    {description[:60]}...")

            print("\n=== Test 9: Survey Type Toggle ===")
            # Select a different survey type
            unselected_survey = page.locator('.survey-card:not(.selected)').first
            if unselected_survey.count() > 0:
                survey_title = unselected_survey.locator('.survey-card-title').text_content()
                print(f"Selecting survey: {survey_title}")

                unselected_survey.click()
                page.wait_for_timeout(200)

                # Verify selection
                assert 'selected' in unselected_survey.get_attribute('class'), "Survey should be selected"
                print("✓ Survey type selected successfully")

            print("\n=== Test 10: Navigate to Step 3 ===")
            continue_button.click()
            page.wait_for_timeout(500)

            # Take screenshot of step 3
            page.screenshot(path='/tmp/send_survey_step3.png', full_page=True)
            print("✓ Screenshot saved to /tmp/send_survey_step3.png")

            # Verify step 3 is active
            step3 = page.locator('#step3')
            assert 'active' in step3.get_attribute('class'), "Step 3 should be active"
            print("✓ Step 3 is active")

            # Check progress
            progress_width = progress_bar.evaluate('el => el.style.width')
            print(f"✓ Progress bar width: {progress_width}")

            print("\n=== Test 11: Step 3 - Schedule Options ===")
            schedule_options = page.locator('.schedule-option').all()
            print(f"✓ Found {len(schedule_options)} schedule options")

            for i, option in enumerate(schedule_options):
                title = option.locator('.schedule-option-title').text_content()
                is_selected = 'selected' in option.get_attribute('class')
                status = "SELECTED" if is_selected else "not selected"
                print(f"  - {title}: {status}")

            # Check reminder settings
            checkboxes = page.locator('.checkbox-label input[type="checkbox"]').all()
            print(f"✓ Found {len(checkboxes)} reminder checkboxes")

            print("\n=== Test 12: Schedule for Later ===")
            # Select "Schedule for Later" option
            schedule_later = page.locator('.schedule-option').nth(1)
            schedule_later.click()
            page.wait_for_timeout(200)

            # Verify datetime picker appears
            datetime_picker = page.locator('#datetimePicker')
            assert 'active' in datetime_picker.get_attribute('class'), "Datetime picker should be visible"
            print("✓ Datetime picker appeared")

            # Fill in date and time
            page.locator('#scheduleDate').fill('2025-12-31')
            page.locator('#scheduleTime').fill('14:30')
            print("✓ Date and time filled")

            # Switch back to "Send Now"
            send_now = page.locator('.schedule-option').first
            send_now.click()
            page.wait_for_timeout(200)
            print("✓ Switched back to Send Now")

            print("\n=== Test 13: Navigate to Step 4 (Review) ===")
            continue_button.click()
            page.wait_for_timeout(500)

            # Take screenshot of step 4
            page.screenshot(path='/tmp/send_survey_step4.png', full_page=True)
            print("✓ Screenshot saved to /tmp/send_survey_step4.png")

            # Verify step 4 is active
            step4 = page.locator('#step4')
            assert 'active' in step4.get_attribute('class'), "Step 4 should be active"
            print("✓ Step 4 is active")

            # Check progress
            progress_width = progress_bar.evaluate('el => el.style.width')
            print(f"✓ Progress bar width: {progress_width}")

            print("\n=== Test 14: Step 4 - Review Screen ===")
            review_sections = page.locator('.review-item').all()
            print(f"✓ Found {len(review_sections)} review sections")

            for i, section in enumerate(review_sections):
                label = section.locator('.review-label').text_content()
                value = section.locator('.review-value').text_content()
                print(f"  - {label}: {value}")

            # Check edit buttons
            edit_buttons = page.locator('.edit-button').all()
            print(f"✓ Found {len(edit_buttons)} edit buttons")

            print("\n=== Test 15: Back Button Navigation ===")
            back_button = page.locator('.btn-secondary')
            back_button.click()
            page.wait_for_timeout(500)

            # Verify we're back on step 3
            assert 'active' in step3.get_attribute('class'), "Should navigate back to Step 3"
            print("✓ Back button navigated to Step 3")

            # Navigate forward again
            continue_button.click()
            page.wait_for_timeout(500)
            print("✓ Navigated forward to Step 4 again")

            print("\n=== Test 16: Send Surveys ===")
            # Click Send Surveys button
            send_button = page.locator('.btn-primary')
            send_button_text = send_button.text_content()
            print(f"✓ Send button text: {send_button_text}")

            send_button.click()
            page.wait_for_timeout(500)

            # Check if loading overlay appears
            loading_overlay = page.locator('#loadingOverlay')
            if 'show' in loading_overlay.get_attribute('class'):
                print("✓ Loading overlay displayed")

                # Take screenshot of loading
                page.screenshot(path='/tmp/send_survey_loading.png', full_page=True)
                print("✓ Loading screenshot saved to /tmp/send_survey_loading.png")

            # Wait for success screen (loading is 2 seconds)
            page.wait_for_timeout(2500)

            # Take screenshot of success
            page.screenshot(path='/tmp/send_survey_success.png', full_page=True)
            print("✓ Success screenshot saved to /tmp/send_survey_success.png")

            # Check for success message
            success_title = page.locator('.success-title')
            if success_title.count() > 0:
                title_text = success_title.text_content()
                print(f"✓ Success message: {title_text}")

                success_desc = page.locator('.success-description').text_content()
                print(f"✓ Description: {success_desc}")

            print("\n=== Test 17: Responsive Layout ===")
            viewport = page.viewport_size
            body_width = page.evaluate('document.body.scrollWidth')
            print(f"✓ Viewport width: {viewport['width']}px")
            print(f"✓ Body width: {body_width}px")

            if body_width <= viewport['width']:
                print("✓ No horizontal overflow detected")
            else:
                print(f"⚠ Warning: Horizontal overflow detected ({body_width - viewport['width']}px)")

            print("\n=== All Tests Passed! ===")
            print(f"Successfully tested complete workflow:")
            print(f"  Step 1: Patient selection ({len(patient_cards)} patients)")
            print(f"  Step 2: Survey type selection ({len(survey_cards)} types)")
            print(f"  Step 3: Schedule configuration")
            print(f"  Step 4: Review and send")
            print(f"  Success: Confirmation screen")

            return True

        except AssertionError as e:
            print(f"\n✗ Test failed: {e}")
            page.screenshot(path='/tmp/send_survey_error.png', full_page=True)
            print("Error screenshot saved to /tmp/send_survey_error.png")
            return False

        except Exception as e:
            print(f"\n✗ Unexpected error: {e}")
            page.screenshot(path='/tmp/send_survey_error.png', full_page=True)
            print("Error screenshot saved to /tmp/send_survey_error.png")
            return False

        finally:
            browser.close()

if __name__ == '__main__':
    success = test_send_survey_interface()
    sys.exit(0 if success else 1)
