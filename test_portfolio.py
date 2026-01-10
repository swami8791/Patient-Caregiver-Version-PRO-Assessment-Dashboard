#!/usr/bin/env python3
"""
Playwright test script for portfolio.html mobile interface
Tests patient detail view with survey history, domain scores, and clinical notes
"""

from playwright.sync_api import sync_playwright
import os
import sys

def test_portfolio_interface():
    """Test the portfolio mobile interface"""

    # Get the absolute path to portfolio.html
    current_dir = os.path.dirname(os.path.abspath(__file__))
    portfolio_path = os.path.join(current_dir, 'portfolio.html')
    file_url = f'file://{portfolio_path}'

    print(f"Testing portfolio interface at: {file_url}")

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
            page.screenshot(path='/tmp/portfolio_initial.png', full_page=True)
            print("✓ Screenshot saved to /tmp/portfolio_initial.png")

            print("\n=== Test 2: Header Elements ===")
            # Check header elements
            assert page.locator('.mobile-header').is_visible(), "Mobile header not found"
            print("✓ Mobile header visible")

            assert page.locator('.patient-name-mobile').is_visible(), "Patient name not found"
            patient_name = page.locator('.patient-name-mobile').text_content()
            print(f"✓ Patient name: {patient_name}")

            assert page.locator('.patient-meta-mobile').is_visible(), "Patient meta not found"
            patient_meta = page.locator('.patient-meta-mobile').text_content()
            print(f"✓ Patient meta: {patient_meta}")

            print("\n=== Test 3: Alert Banner ===")
            assert page.locator('.alert-mobile').is_visible(), "Alert banner not found"
            alert_text = page.locator('.alert-content-mobile').text_content()
            print(f"✓ Alert visible: {alert_text}")

            print("\n=== Test 4: Score Summary ===")
            # Check score summary
            assert page.locator('.score-summary-mobile').is_visible(), "Score summary not found"
            print("✓ Score summary visible")

            child_score = page.locator('.score-item-mobile').nth(0).locator('.score-value-mobile').text_content()
            parent_score = page.locator('.score-item-mobile').nth(1).locator('.score-value-mobile').text_content()
            print(f"✓ Child Score: {child_score}")
            print(f"✓ Parent Score: {parent_score}")

            discrepancy = page.locator('.discrepancy-badge-mobile').text_content()
            print(f"✓ Discrepancy: {discrepancy}")

            print("\n=== Test 5: Navigation Tabs ===")
            tabs = page.locator('.tab-mobile').all()
            print(f"✓ Found {len(tabs)} tabs")

            for i, tab in enumerate(tabs):
                tab_text = tab.text_content()
                is_active = 'active' in tab.get_attribute('class')
                status = "ACTIVE" if is_active else "inactive"
                print(f"  - {tab_text}: {status}")

            print("\n=== Test 6: Domain Cards ===")
            domain_cards = page.locator('.domain-card-mobile').all()
            print(f"✓ Found {len(domain_cards)} domain cards")

            for i, card in enumerate(domain_cards):
                domain_name = card.locator('.domain-title-mobile').text_content()
                child_val = card.locator('.domain-score-item').nth(0).locator('.domain-score-value').text_content()
                parent_val = card.locator('.domain-score-item').nth(1).locator('.domain-score-value').text_content()
                print(f"  - {domain_name}: Child={child_val}, Parent={parent_val}")

            print("\n=== Test 7: Survey Timeline ===")
            timeline_items = page.locator('.timeline-item-mobile').all()
            print(f"✓ Found {len(timeline_items)} timeline items")

            for i, item in enumerate(timeline_items):
                title = item.locator('.timeline-title-mobile').text_content()
                date = item.locator('.timeline-date-mobile').text_content()
                print(f"  - {title} ({date})")

            print("\n=== Test 8: Clinical Notes ===")
            notes = page.locator('.note-mobile').all()
            print(f"✓ Found {len(notes)} clinical notes")

            for i, note in enumerate(notes):
                author = note.locator('.note-author-mobile').text_content()
                date = note.locator('.note-date-mobile').text_content()
                print(f"  - {author} ({date})")

            print("\n=== Test 9: Bottom Navigation ===")
            nav_items = page.locator('.nav-item').all()
            print(f"✓ Found {len(nav_items)} navigation items")

            for i, nav in enumerate(nav_items):
                text = nav.text_content().strip()
                is_active = 'active' in nav.get_attribute('class')
                status = "ACTIVE" if is_active else "inactive"
                print(f"  - {text}: {status}")

            print("\n=== Test 10: Detail Sheet Modal (Click Test) ===")
            # Click on first timeline item to open detail sheet
            first_timeline = page.locator('.timeline-item-mobile').first

            # Verify detail sheet is hidden initially
            detail_sheet = page.locator('#detailSheet')
            assert not 'show' in detail_sheet.get_attribute('class'), "Detail sheet should be hidden initially"
            print("✓ Detail sheet initially hidden")

            # Click to open detail sheet
            first_timeline.click()
            page.wait_for_timeout(500)  # Wait for animation

            # Take screenshot with detail sheet
            page.screenshot(path='/tmp/portfolio_detail_sheet.png', full_page=True)
            print("✓ Detail sheet screenshot saved to /tmp/portfolio_detail_sheet.png")

            # Verify detail sheet is visible
            assert 'show' in detail_sheet.get_attribute('class'), "Detail sheet should be visible after click"
            print("✓ Detail sheet opened successfully")

            # Check detail sheet content
            sheet_title = page.locator('.sheet-title').text_content()
            print(f"✓ Detail sheet title: {sheet_title}")

            response_items = page.locator('.response-item').all()
            print(f"✓ Found {len(response_items)} response items in detail sheet")

            print("\n=== Test 11: Close Detail Sheet (Overlay Click) ===")
            # Click overlay to close
            overlay = page.locator('#overlay')
            overlay.click()
            page.wait_for_timeout(500)  # Wait for animation

            # Verify detail sheet is hidden
            assert not 'show' in detail_sheet.get_attribute('class'), "Detail sheet should be hidden after overlay click"
            print("✓ Detail sheet closed via overlay click")

            print("\n=== Test 12: Quick Action Buttons ===")
            fab_buttons = page.locator('.fab').all()
            print(f"✓ Found {len(fab_buttons)} floating action buttons")

            print("\n=== Test 13: Responsive Layout ===")
            # Check that content doesn't overflow
            viewport = page.viewport_size
            body_width = page.evaluate('document.body.scrollWidth')
            print(f"✓ Viewport width: {viewport['width']}px")
            print(f"✓ Body width: {body_width}px")

            if body_width <= viewport['width']:
                print("✓ No horizontal overflow detected")
            else:
                print(f"⚠ Warning: Horizontal overflow detected ({body_width - viewport['width']}px)")

            print("\n=== All Tests Passed! ===")
            print(f"Total elements verified:")
            print(f"  - {len(tabs)} tabs")
            print(f"  - {len(domain_cards)} domain cards")
            print(f"  - {len(timeline_items)} timeline items")
            print(f"  - {len(notes)} clinical notes")
            print(f"  - {len(nav_items)} navigation items")
            print(f"  - {len(response_items)} detail sheet responses")

            return True

        except AssertionError as e:
            print(f"\n✗ Test failed: {e}")
            page.screenshot(path='/tmp/portfolio_error.png', full_page=True)
            print("Error screenshot saved to /tmp/portfolio_error.png")
            return False

        except Exception as e:
            print(f"\n✗ Unexpected error: {e}")
            page.screenshot(path='/tmp/portfolio_error.png', full_page=True)
            print("Error screenshot saved to /tmp/portfolio_error.png")
            return False

        finally:
            browser.close()

if __name__ == '__main__':
    success = test_portfolio_interface()
    sys.exit(0 if success else 1)
