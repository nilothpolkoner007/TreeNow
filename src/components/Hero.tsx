@@ .. @@
             <Link
               to='/krishi-help'
               className='flex items-center justify-center space-x-2 rounded-lg bg-emerald-700 px-6 py-4 text-white font-semibold hover:bg-emerald-600 transition-colors'
             >
               <Wheat className='h-5 w-5' />
               <span>Krishi Help</span>
             </Link>
+            <Link
+              to='/location-trees'
+              className='flex items-center justify-center space-x-2 rounded-lg bg-emerald-500 px-6 py-4 text-white font-semibold hover:bg-emerald-400 transition-colors'
+            >
+              <MapPin className='h-5 w-5' />
+              <span>Local Trees</span>
+            </Link>
           </div>
         </div>
       </div>
@@ .. @@
 import React from 'react';
-import { Leaf, Sprout, Wheat } from 'lucide-react';
+import { Leaf, Sprout, Wheat, MapPin } from 'lucide-react';
 import { Link } from 'react-router-dom';