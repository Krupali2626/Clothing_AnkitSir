import mongoose from 'mongoose';
import UserModel from '../model/user.model.js';
import { config } from 'dotenv';

config();

/**
 * Migration Script: Clean up ALL invalid saved cards
 * 
 * This script removes any saved cards that don't have ALL required fields
 * for the new Stripe Payment Method structure.
 * 
 * Required fields:
 * - stripePaymentMethodId
 * - last4
 * - brand
 * - expiryMonth
 * - expiryYear
 * 
 * Run this to clean up any cards with old or incomplete data.
 */

async function cleanupInvalidCards() {
  try {
    console.log('🔄 Starting comprehensive saved cards cleanup...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users with saved cards
    const users = await UserModel.find({ 
      'savedCards.0': { $exists: true } 
    });

    console.log(`📊 Found ${users.length} users with saved cards`);

    let cleanedCount = 0;
    let totalCardsRemoved = 0;
    let totalCardsKept = 0;

    for (const user of users) {
      const originalCardCount = user.savedCards.length;
      const validCards = [];

      for (const card of user.savedCards) {
        // Check if card has ALL required fields for new Stripe structure
        const hasAllRequiredFields = 
          card.stripePaymentMethodId && 
          card.last4 && 
          card.brand && 
          card.expiryMonth && 
          card.expiryYear;

        if (hasAllRequiredFields) {
          // Valid new format - keep it
          validCards.push(card);
          totalCardsKept++;
          console.log(`  ✅ Keeping valid card for user ${user.email || user._id}: ${card.brand} ending in ${card.last4}`);
        } else {
          // Invalid or incomplete card - remove it
          totalCardsRemoved++;
          console.log(`  ❌ Removing invalid card for user ${user.email || user._id}:`, {
            hasStripeId: !!card.stripePaymentMethodId,
            hasLast4: !!card.last4,
            hasBrand: !!card.brand,
            hasExpiryMonth: !!card.expiryMonth,
            hasExpiryYear: !!card.expiryYear,
            hasOldCardNumber: !!card.cardNumber,
            hasOldCVV: !!card.cvv
          });
        }
      }

      if (originalCardCount !== validCards.length) {
        user.savedCards = validCards;
        
        // If default card was removed, set first valid card as default
        if (validCards.length > 0) {
          const hasDefault = validCards.some(card => card.isDefault);
          if (!hasDefault) {
            validCards[0].isDefault = true;
            console.log(`  🔄 Set first card as default for user ${user.email || user._id}`);
          }
        }
        
        await user.save();
        cleanedCount++;
        console.log(`  ✅ Cleaned user ${user.email || user._id}: ${originalCardCount} → ${validCards.length} cards`);
      }
    }

    console.log('\n📈 Cleanup Summary:');
    console.log(`  - Users processed: ${users.length}`);
    console.log(`  - Users cleaned: ${cleanedCount}`);
    console.log(`  - Cards removed: ${totalCardsRemoved}`);
    console.log(`  - Cards kept: ${totalCardsKept}`);
    console.log('\n✅ Cleanup completed successfully!');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the migration
cleanupInvalidCards();
