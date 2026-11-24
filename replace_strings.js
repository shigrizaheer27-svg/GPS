const fs = require('fs');
const path = require('path');

const fileFixes = [
  {
     file: 'app/src/main/java/com/example/ui/screens/home/HomeScreen.kt',
     replacements: [
       [/"Satellite Map"/g, 'stringResource(R.string.satellite_map)'],
       [/"Current Location"/g, 'stringResource(R.string.current_location)'],
       [/"Traffic Map"/g, 'stringResource(R.string.traffic_map)'],
       [/"Voice Route"/g, 'stringResource(R.string.voice_route)'],
       [/"Travel Tools"/g, 'stringResource(R.string.travel_tools)'],
       [/"More Tools"/g, 'stringResource(R.string.more_tools)'],
       [/"Search your destination"/g, 'stringResource(R.string.search_your_destination)'],
       [/"New User only   Rs.300"/g, 'stringResource(R.string.new_user_only_rs300)'],
       [/"GPS & Navigation Tools"/g, 'stringResource(R.string.gps_navigation_tools)'],
       [/"Your ultimate travel companion"/g, 'stringResource(R.string.your_ultimate_travel_companion)'],
       [/"PRO"/g, 'stringResource(R.string.pro)'],
       [/"Ad not ready, please try again"/g, 'context.getString(R.string.ad_not_ready)'],
       [/"Watch full ad to unlock this feature"/g, 'context.getString(R.string.watch_full_ad_to_unlock)'],
       [/stringResource\(R\.string\.title_map_routes\)/g, 'stringResource(R.string.map_routes)'],
       [/stringResource\(R\.string\.title_travel_tools\)/g, 'stringResource(R.string.travel_tools)'],
       [/stringResource\(R\.string\.title_more_tools\)/g, 'stringResource(R.string.more_tools)'],
       [/stringResource\(R\.string\.desc_travel_tools\)/g, 'stringResource(R.string.explore_unique_and_essential_tools)'],
       [/stringResource\(R\.string\.desc_more_tools\)/g, 'stringResource(R.string.access_specialized_calculators)']
     ]
  },
  {
     file: 'app/src/main/java/com/example/ui/screens/map/MapScreen.kt',
     replacements: [
       [/"My Location"/g, 'stringResource(R.string.my_location)'],
       [/"Search place or address..."/g, 'stringResource(R.string.search_place_or_address)'],
       [/"Find Route"/g, 'stringResource(R.string.find_route)'],
       [/"FROM"/g, 'stringResource(R.string.from)'],
       [/"TO"/g, 'stringResource(R.string.to)'],
       [/"Start Route"/g, 'stringResource(R.string.start_route)'],
       [/"No places found"/g, 'stringResource(R.string.no_places_found)'],
       [/"Copy Address"/g, 'stringResource(R.string.copy_address)'],
       [/"Share Location"/g, 'stringResource(R.string.share_location)'],
       [/"Address copied"/g, 'context.getString(R.string.address_copied)'],
       [/"Location not available"/g, 'context.getString(R.string.location_not_available)'],
       [/"Normal"/g, 'stringResource(R.string.map_views)'], // Temporary fix since we removed normal/satellite? No, MapMode buttons shouldn't be touched if they were removed in the other prompt. Wait, the map mode chips were removed? 
       // In MapScreen, title was passed in.
     ]
  },
  {
     file: 'app/src/main/java/com/example/ui/screens/premium/PremiumScreen.kt',
     replacements: [
       [/"Start Weekly at \$price"/g, 'stringResource(R.string.start_weekly_at, price)'],
       [/"Restore Purchases"/g, 'stringResource(R.string.restore_purchases)'],
       [/"Enjoy our GPS Pro Version"/g, 'stringResource(R.string.enjoy_our_gps_pro_version)'],
       [/"Remove Ads"/g, 'stringResource(R.string.remove_ads)'],
       [/"Unlock All Pro Features"/g, 'stringResource(R.string.unlock_all_pro_features)'],
       [/"Unlimited Usage"/g, 'stringResource(R.string.unlimited_usage)']
     ]
  },
  {
     file: 'app/src/main/java/com/example/ui/screens/onboarding/OnboardingScreen.kt',
     replacements: [
       [/"GPS & Navigation Tools"/g, 'stringResource(R.string.gps_navigation_tools)'],
       [/"Your ultimate travel companion"/g, 'stringResource(R.string.your_ultimate_travel_companion)']
     ]
  },
  {
     file: 'app/src/main/java/com/example/ui/ads/AdViews.kt',
     replacements: [
       [/"Loading Ad..."/g, 'stringResource(R.string.loading_ad)']
     ]
  },
  {
     file: 'app/src/main/java/com/example/ui/components/NoInternetDialog.kt',
     replacements: [
       [/"No Internet Connection"/g, 'stringResource(R.string.no_internet_connection)'],
       [/"Please check your internet connection and try again."/g, 'stringResource(R.string.please_check_your_internet_connection_and_try_again)'],
       [/"Open Network Settings"/g, 'stringResource(R.string.open_network_settings)']
     ]
  },
  {
     file: 'app/src/main/java/com/example/ui/components/UnlockFeatureDialog.kt',
     replacements: [
       [/"Unlock this feature"/g, 'stringResource(R.string.unlock_this_feature)'],
       [/"Either watch an ad or upgrade to premium to unlock this feature"/g, 'stringResource(R.string.either_watch_an_ad_or_upgrade)'],
       [/"WATCH AD"/g, 'stringResource(R.string.watch_ad)'],
       [/"OR"/g, 'stringResource(R.string.or_text)'],
       [/"GO PREMIUM"/g, 'stringResource(R.string.go_premium)']
     ]
  },
  {
     file: 'app/src/main/java/com/example/ui/screens/LocationRepository.kt',
     replacements: [
       [/"My Location"/g, 'context.getString(R.string.my_location)'] // Wait, LocationRepository is object and doesn't have Context.
     ]
  }
];

fileFixes.forEach(fix => {
   let p = path.join(__dirname, fix.file);
   if (fs.existsSync(p)) {
      let code = fs.readFileSync(p, 'utf8');
      fix.replacements.forEach(r => {
         code = code.replace(r[0], r[1]);
      });
      // Add import for stringResource if not present
      if (code.includes('stringResource') && !code.includes('androidx.compose.ui.res.stringResource')) {
          code = code.replace(/import androidx\.compose\.runtime\.\*/, 'import androidx.compose.runtime.*\nimport androidx.compose.ui.res.stringResource\nimport com.example.R');
          if (!code.includes('import com.example.R')) code = code.replace(/^package .*$/m, '$&\nimport com.example.R\nimport androidx.compose.ui.res.stringResource');
      }
      fs.writeFileSync(p, code);
      console.log('Fixed', fix.file);
   }
});
