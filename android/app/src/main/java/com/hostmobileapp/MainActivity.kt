package com.livedinapp

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "HostMobileApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    // Prevent duplicate activity when app is relaunched from launcher while already in background.
    // Without this, a ghost Activity sits on top and hardware back dismisses it instead of
    // letting React Navigation handle it.
    if (!isTaskRoot
        && intent.hasCategory(Intent.CATEGORY_LAUNCHER)
        && intent.action == Intent.ACTION_MAIN) {
      finish()
      return
    }
    super.onCreate(savedInstanceState)
  }
}
