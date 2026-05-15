import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Capture console logs
    page.on("console", lambda msg: print(f"Browser Console: {msg.type}: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Browser Error: {err}"))
    
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(5000) # give spline time to load
    
    # Screenshot the fab button specifically
    fab = page.locator('button[aria-label="Open chat"]')
    if fab.count() > 0:
        fab.screenshot(path='/home/rayu/company_portfolio/app/fab.png')
        print(f"FAB bounds: {fab.bounding_box()}")
        
        # also screenshot full page
        page.screenshot(path='/home/rayu/company_portfolio/app/full.png')
    else:
        print("FAB not found")
        
    browser.close()
